
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

const targetChurch = "관평동 성당";
const targetCuria = "원죄없으신 성모마리아";
const targetPr = "천사의 모후";

const clean = (s) => String(s || '').toLowerCase().replace(/천주교|교회|성당|쁘레시디움|Pr\.?|꾸리아|Cu\.?|레지아|Re\.?|세나뚜스|Se\.?|\s/g, '').trim();

async function debugMatch() {
    console.log("--- Debugging isMatch for Business Report ---");
    console.log("Target Church:", targetChurch, "-> Cleaned:", clean(targetChurch));
    console.log("Target Curia:", targetCuria, "-> Cleaned:", clean(targetCuria));
    console.log("Target Pr:", targetPr, "-> Cleaned:", clean(targetPr));

    const prSnap = await db.collection('presidia_list').where('presidiumName', '==', targetPr).get();
    
    if (prSnap.empty) {
        console.log("❌ No document found in presidia_list for presidiumName:", targetPr);
        return;
    }

    prSnap.forEach(doc => {
        const data = doc.data();
        console.log("\nFound Document in presidia_list:");
        console.log("ID:", doc.id);
        console.log("churchName:", data.churchName, "-> Cleaned:", clean(data.churchName));
        console.log("curiaName:", data.curiaName, "-> Cleaned:", clean(data.curiaName));
        console.log("presidiumName:", data.presidiumName, "-> Cleaned:", clean(data.presidiumName));

        const cc = clean(data.churchName || data.church);
        const cp = clean(data.presidiumName || data.name);
        const ccr = clean(data.curiaName || data.curia);

        const tc = clean(targetChurch);
        const tp = clean(targetPr);
        const tcr = clean(targetCuria);

        console.log("\nComparison Result:");
        console.log("cc (!cc):", cc, !!cc);
        console.log("cp (!cp):", cp, !!cp);
        console.log("ccr (!ccr):", ccr, !!ccr);
        
        const strictMatch = (!cc || !cp || !ccr) ? "FAIL (One is empty)" : (cc === tc && cp === tp && ccr === tcr ? "SUCCESS" : "FAIL (Value mismatch)");
        console.log("Strict Match Result (v16.86):", strictMatch);
    });
}

debugMatch();
