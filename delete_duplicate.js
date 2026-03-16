const https = require('https');

const PROJECT_ID = 'legion-f319a';
const COLLECTION = 'presidia_list';
const DOC_ID = 'ug9OmxykRPYg3sQRn7ja'; // 중복된 빈 데이터 ID
const URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${COLLECTION}/${DOC_ID}`;

const options = {
    method: 'DELETE'
};

const req = https.request(URL, options, (res) => {
    if (res.statusCode === 200 || res.statusCode === 204) {
        console.log(`Successfully deleted duplicate document: ${DOC_ID}`);
    } else {
        console.log(`Failed to delete. Status code: ${res.statusCode}`);
        let body = '';
        res.on('data', d => body += d);
        res.on('end', () => console.log('Error response:', body));
    }
});

req.on('error', (e) => {
    console.error('Request error:', e.message);
});

req.end();
