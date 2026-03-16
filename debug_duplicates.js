const https = require('https');

const PROJECT_ID = 'legion-f319a';
const COLLECTION = 'presidia_list';
const URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${COLLECTION}?pageSize=1000`;

https.get(URL, (res) => {
    let body = '';
    res.on('data', d => body += d);
    res.on('end', () => {
        try {
            const data = JSON.parse(body);
            if (!data.documents) {
                console.log('No documents found');
                return;
            }
            const targetName = '천사의 모후';
            const matches = data.documents.filter(d => {
                const f = d.fields;
                const name = (f.presidiumName || f.presidium || f.name || {}).stringValue;
                return name === targetName;
            });

            console.log(`Found ${matches.length} matches for "${targetName}"\n`);
            matches.forEach((m, i) => {
                console.log(`--- Match ${i + 1} ---`);
                console.log('ID:', m.name.split('/').pop());
                console.log('Church:', (m.fields.churchName || m.fields.church || {}).stringValue);
                console.log('Curia:', (m.fields.curiaName || m.fields.curia || {}).stringValue);
                console.log('UniqueNumber:', (m.fields.uniqueNumber || {}).stringValue);
                console.log('Fields:', Object.keys(m.fields).join(', '));
                console.log('------------------\n');
            });
        } catch (e) {
            console.error('Error parsing JSON:', e.message);
        }
    });
}).on('error', (e) => {
    console.error('Request error:', e.message);
});
