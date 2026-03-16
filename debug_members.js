const https = require('https');
const fs = require('fs');

const PROJECT_ID = 'legion-f319a';
const COLLECTION = 'members_list';
const URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${COLLECTION}?pageSize=20`;

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
            console.log('--- 멤버 목록 데이터 구조 점검 ---');
            data.documents.forEach((d, i) => {
                const f = d.fields;
                const name = (f.name || {}).stringValue;
                const role = (f.role || {}).stringValue;
                const pr = (f.presidiumName || f.presidium || {}).stringValue;
                console.log(`${i+1}. 이름: ${name}, 역할: [${role}], 쁘레: [${pr}]`);
            });
        } catch (e) {
            console.log('PARSE_ERROR');
        }
    });
});
