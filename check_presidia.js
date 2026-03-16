const https = require('https');
const fs = require('fs');

const PROJECT_ID = 'legion-f319a';
const COLLECTION = 'presidia_list';
const URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${COLLECTION}?pageSize=100`;

https.get(URL, (res) => {
    let body = '';
    res.on('data', d => body += d);
    res.on('end', () => {
        fs.writeFileSync('db_check_result.json', body);
        try {
            const data = JSON.parse(body);
            if (!data.documents) {
                console.log('NO_DOCUMENTS');
                return;
            }
            data.documents.forEach((d, i) => {
                const f = d.fields;
                const name = (f.presidiumName || f.presidium || f.name || {}).stringValue;
                const church = (f.churchName || f.church || {}).stringValue;
                console.log(`${i+1}. [${church}] ${name} (ID: ${d.name.split('/').pop()})`);
            });
        } catch (e) {
            console.log('PARSE_ERROR');
        }
    });
});
