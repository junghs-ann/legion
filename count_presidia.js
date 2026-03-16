const https = require('https');

const PROJECT_ID = 'legion-f319a';
const COLLECTION = 'presidia_list';
const URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${COLLECTION}?pageSize=1000`;

https.get(URL, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            const count = json.documents ? json.documents.length : 0;
            console.log(`COUNT_RESULT:${count}`);
        } catch (e) {
            console.error('Error:', e.message);
        }
    });
}).on('error', (err) => {
    console.error('Connection Error:', err.message);
});
