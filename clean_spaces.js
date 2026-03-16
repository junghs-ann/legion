const https = require('https');

const PROJECT_ID = 'legion-f319a';
const COLLECTION = 'members_list';

// Helper to fetch documents
async function getDocs() {
    return new Promise((resolve, reject) => {
        const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${COLLECTION}`;
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => resolve(JSON.parse(data)));
        }).on('error', reject);
    });
}

// Helper to update a document via PATCH (REST API)
async function updateDoc(docName, trimmedFields) {
    return new Promise((resolve, reject) => {
        const url = `https://firestore.googleapis.com/v1/${docName}?updateMask.fieldPaths=${Object.keys(trimmedFields).join('&updateMask.fieldPaths=')}`;
        const options = {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' }
        };
        const req = https.request(url, options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => resolve(JSON.parse(data)));
        });
        req.on('error', reject);
        
        // Construct the Firestore REST payload
        const fields = {};
        for (const [key, value] of Object.entries(trimmedFields)) {
            fields[key] = { stringValue: value };
        }
        req.write(JSON.stringify({ fields }));
        req.end();
    });
}

async function runCleanup() {
    console.log("🚀 [공백 소탕 작전 시작]");
    try {
        const result = await getDocs();
        if (!result.documents) {
            console.log("❌ 데이터가 없습니다.");
            return;
        }

        let count = 0;
        for (const doc of result.documents) {
            const fields = doc.fields;
            const updates = {};
            let hasChange = false;

            for (const [key, valObj] of Object.entries(fields)) {
                if (valObj.stringValue) {
                    const original = valObj.stringValue;
                    const trimmed = original.trim();
                    if (original !== trimmed) {
                        updates[key] = trimmed;
                        hasChange = true;
                    }
                }
            }

            if (hasChange) {
                console.log(`🧹 정제 중: ${fields.name?.stringValue || '익명'} (${doc.name.split('/').pop()})`);
                await updateDoc(doc.name, updates);
                count++;
            }
        }
        console.log(`✅ 작전 완료: 총 ${count}건의 데이터를 정제했습니다.`);
    } catch (err) {
        console.error("🚨 작전 실패:", err.message);
    }
}

runCleanup();
