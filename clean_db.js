const https = require('https');

const PROJECT_ID = 'legion-f319a';
const COLLECTION = 'presidia_list';
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${COLLECTION}`;

function deleteDoc(docPath) {
    return new Promise((resolve) => {
        const options = {
            method: 'DELETE',
            hostname: 'firestore.googleapis.com',
            path: `/v1/${docPath}`
        };
        const req = https.request(options, (res) => {
            console.log(`DELETED ${docPath}: ${res.statusCode}`);
            resolve();
        });
        req.on('error', (e) => {
            console.error(`ERROR deleting ${docPath}:`, e.message);
            resolve();
        });
        req.end();
    });
}

https.get(BASE_URL + '?pageSize=1000', (res) => {
    let data = '';
    res.on('data', (d) => data += d);
    res.on('end', async () => {
        try {
            const json = JSON.parse(data);
            if (!json.documents) {
                console.log('NO_DOCUMENTS_FOUND');
                process.exit(0);
            }
            console.log(`FOUND ${json.documents.length} DOCS. STARTING DELETE...`);
            for (const doc of json.documents) {
                await deleteDoc(doc.name);
            }
            console.log('ALL_DELETED_SUCCESSFULLY');
        } catch (e) {
            console.error('PARSE_ERROR:', e.message);
            console.log('RAW_DATA:', data);
        }
    });
});
