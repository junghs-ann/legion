const https = require('https');

const PROJECT_ID = 'legion-f319a';
const collections = [
    'presidia_list', 'members_list', 'officers_list', 'attendance_list', 
    'activity_records', 'accounting_transactions', 'events_list', 
    'praetorium_list', 'auxiliary_members_list', 'adjutorium_members_list'
];

async function checkCollection(col) {
    return new Promise((resolve) => {
        const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${col}`;
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    const docs = json.documents || [];
                    const result = {
                        name: col,
                        total: docs.length,
                        missing: 0
                    };
                    docs.forEach(doc => {
                        const fields = doc.fields || {};
                        const c = fields.churchName || fields.church;
                        const cr = fields.curiaName || fields.curia;
                        const pr = fields.presidiumName || fields.presidium;
                        if (!c || !cr || !pr) {
                            result.missing++;
                        }
                    });
                    resolve(result);
                } catch (e) { resolve({ name: col, total: 0, missing: 0, error: e.message }); }
            });
        }).on('error', (e) => resolve({ name: col, total: 0, missing: 0, error: e.message }));
    });
}

async function run() {
    console.log(`\n🚀 [전수 조사 시작] 프로젝트: ${PROJECT_ID}`);
    console.log(`--------------------------------------------------`);
    let grandTotal = 0;
    let grandMissing = 0;
    
    for (const col of collections) {
        const res = await checkCollection(col);
        const status = res.missing > 0 ? `❌ 누락 ${res.missing}건` : `✅ 깨끗함`;
        console.log(`- ${res.name.padEnd(25)}: 총 ${res.total.toString().padStart(2)}건 [${status}]`);
        grandTotal += res.total;
        grandMissing += res.missing;
    }
    
    console.log(`--------------------------------------------------`);
    console.log(`📊 합계: 총 ${grandTotal}건 중 결함 ${grandMissing}건 발견`);
    if (grandMissing === 0 && grandTotal > 0) {
        console.log(`\n🎉 축하합니다! 모든 데이터가 성당/꾸리아 정보를 완벽히 갖추고 있습니다.`);
    } else if (grandTotal === 0) {
        console.log(`\n⚠️ DB가 현재 완전히 비어있습니다.`);
    }
}

run();
