const https = require('https');

const PROJECT_ID = 'legion-f319a';
const COLLECTION = 'accounting_items';
const URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${COLLECTION}?pageSize=5`;

https.get(URL, (res) => {
    let body = '';
    res.on('data', d => body += d);
    res.on('end', () => {
        try {
            const data = JSON.parse(body);
            if (!data.documents || data.documents.length === 0) {
                console.log('No documents found in accounting_items');
                return;
            }
            console.log(`Checking ${data.documents.length} records...`);
            data.documents.forEach((d, i) => {
                const fields = d.fields;
                console.log(`--- Record ${i+1} ---`);
                console.log('Fields present:', Object.keys(fields).join(', '));
                if (fields.name) console.log('name:', fields.name.stringValue);
                if (fields.category) console.log('category:', fields.category.stringValue);
                if (fields.itemName) console.log('itemName:', fields.itemName.stringValue);
                if (fields.churchName) console.log('churchName:', fields.churchName.stringValue);
                if (fields.church) console.log('church:', fields.church.stringValue);
            });
        } catch (e) {
            console.error('Error:', e.message);
        }
    });
});
