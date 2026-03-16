const https = require('https');
const fs = require('fs');

const PROJECT_ID = 'legion-f319a';
const COLLECTION = 'praetorium_list';
const URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${COLLECTION}?pageSize=100`;

https.get(URL, (res) => {
    let body = '';
    res.on('data', d => body += d);
    res.on('end', () => {
        try {
            const data = JSON.parse(body);
            if (!data.documents) {
                console.log('NO_DOCUMENTS');
                return;
            }
            data.documents.forEach((d, i) => {
                const f = d.fields;
                const church = (f.church || {}).stringValue;
                const memberName = (f.memberName || {}).stringValue;
                const baptismalName = (f.baptismalName || {}).stringValue;
                const joinDate = (f.joinDate || {}).stringValue;
                console.log(`${i+1}. [${church}] ${memberName} (${baptismalName}) - 입단일: ${joinDate} (ID: ${d.name.split('/').pop()})`);
            });
        } catch (e) {
            console.log('PARSE_ERROR');
        }
    });
});
