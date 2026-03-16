const https = require('https');

const PROJECT_ID = 'legion-f319a';
const COLLECTION = 'presidia_list';
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${COLLECTION}`;

async function deleteAll() {
    https.get(BASE_URL + '?pageSize=1000', (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', async () => {
            try {
                const json = JSON.parse(data);
                if (!json.documents || json.documents.length === 0) {
                    console.log('CLEAN_SUCCESS:No documents found.');
                    return;
                }

                console.log(`Found ${json.documents.length} documents. Deleting...`);
                
                let deletedCount = 0;
                for (const doc of json.documents) {
                    const docPath = doc.name;
                    await new Promise((resolve) => {
                        const delReq = https.request(`https://firestore.googleapis.com/v1/${docPath}`, { method: 'DELETE' }, (delRes) => {
                            deletedCount++;
                            resolve();
                        });
                        delReq.on('error', (e) => {
                            console.error(`Error deleting ${docPath}:`, e.message);
                            resolve();
                        });
                        delReq.end();
                    });
                }
                console.log(`CLEAN_SUCCESS:Deleted ${deletedCount} documents.`);
            } catch (e) {
                console.error('Error during cleanup:', e.message);
            }
        });
    }).on('error', (err) => {
        console.error('Connection Error:', err.message);
    });
}

deleteAll();
