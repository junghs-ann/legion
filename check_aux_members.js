const https = require('https');
const fs = require('fs');

const PROJECT_ID = 'legion-f319a';
const COLLECTION = 'members_list';
const URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${COLLECTION}?pageSize=50`;

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
            console.log('--- 협조단원 목록 점검 ---');
            data.documents.forEach((d, i) => {
                const f = d.fields;
                const role = (f.role || {}).stringValue;
                if (role === '협조단원') {
                    const name = (f.name || {}).stringValue;
                    const pr = (f.presidiumName || f.presidium || {}).stringValue;
                    const activeMemberName = (f.activeMemberName || {}).stringValue;
                    const activeMemberId = (f.activeMemberId || {}).stringValue;
                    console.log(`${i+1}. [${pr}] ${name} - 담당: ${activeMemberName} (ID: ${activeMemberId})`);
                }
            });
        } catch (e) {
            console.log('PARSE_ERROR');
        }
    });
});
