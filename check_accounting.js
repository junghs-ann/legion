const fetch = require('node-fetch');
async function check() {
    const projectId = 'legion-f319a';
    const baseUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;

    console.log('--- Checking global_configs/accounting_summaries ---');
    try {
        const res = await fetch(`${baseUrl}/global_configs/accounting_summaries`);
        const json = await res.json();
        if (json.fields) {
            console.log('Found in global_configs!');
        } else {
            console.log('Not found in global_configs.');
        }
    } catch (e) {
        console.log('Error checking global_configs');
    }

    console.log('--- Checking accounting_summaries collection ---');
    try {
        const res = await fetch(`${baseUrl}/accounting_summaries?pageSize=1`);
        const json = await res.json();
        if (json.documents) {
            console.log('Found accounting_summaries collection!');
            console.log(JSON.stringify(json.documents[0], null, 2));
        } else {
            console.log('Accounting_summaries collection is empty or not found.');
        }
    } catch (e) {
        console.log('Error checking accounting_summaries collection');
    }
}
check();
