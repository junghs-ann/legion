
import { db, collection, query, where, getDocs } from './firebase-config.js';

async function inspectData() {
    const pr = '천사의 모후';
    const date = '2026-01-06';
    
    console.log(`[Inspect] Searching for Activity Records in Pr: ${pr}, Date: ${date}`);
    
    const collections = ['activity_records'];
    for (const colName of collections) {
        const q1 = query(collection(db, colName), where('presidiumName', '==', pr), where('date', '==', date));
        const q2 = query(collection(db, colName), where('presidium', '==', pr), where('date', '==', date));
        
        const [s1, s2] = await Promise.all([getDocs(q1), getDocs(q2)]);
        
        const allDocs = new Map();
        s1.forEach(d => allDocs.set(d.id, { source: 'new_field', ...d.data() }));
        s2.forEach(d => {
            if (allDocs.has(d.id)) {
                allDocs.get(d.id).source = 'both_fields';
            } else {
                allDocs.set(d.id, { source: 'old_field', ...d.data() });
            }
        });
        
        console.log(`--- Collection: ${colName} ---`);
        if (allDocs.size === 0) {
            console.log("No documents found.");
        }
        allDocs.forEach((data, id) => {
            console.log(`ID: ${id}`);
            console.log(`  Source: ${data.source}`);
            console.log(`  Member: ${data.memberName}`);
            console.log(`  Counts: ${JSON.stringify(data.counts)}`);
            console.log(`  Fields: churchName:${data.churchName}, church:${data.church}, presidiumName:${data.presidiumName}, presidium:${data.presidium}`);
        });
    }
}

inspectData();
