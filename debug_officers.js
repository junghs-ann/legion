
import { db, collection, getDocs, query, where } from './firebase-config.js';

async function checkData() {
    console.log("--- Officers List Search (유주연) ---");
    const q = query(collection(db, 'officers_list'), where('name', '==', '유주연'));
    const snap = await getDocs(q);
    snap.forEach(doc => {
        console.log("ID:", doc.id, JSON.stringify(doc.data(), null, 2));
    });

    console.log("\n--- Officers List Search (김영숙) ---");
    const q2 = query(collection(db, 'officers_list'), where('name', '==', '김영숙'));
    const snap2 = await getDocs(q2);
    snap2.forEach(doc => {
        console.log("ID:", doc.id, JSON.stringify(doc.data(), null, 2));
    });

    console.log("\n--- End of Search ---");
    process.exit(0);
}

checkData();
