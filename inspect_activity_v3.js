import { db, collection, getDocs, query, where } from "./firebase-config.js";

async function inspectRecords() {
    console.log("--- Inspecting Activity Records for session 917 ---");
    const q = query(collection(db, 'activity_records'), 
        where('session', 'in', [917, "917"])
    );
    const snap = await getDocs(q);
    console.log(`Found ${snap.size} records for session 917`);
    snap.forEach(doc => {
        const data = doc.data();
        console.log(`ID: ${doc.id}`);
        console.log(`- Member: ${data.memberName} (${data.memberId})`);
        console.log(`- Church: ${data.churchName}`);
        console.log(`- Presidium: ${data.presidiumName}`);
        console.log(`- Session: ${data.session} (type: ${typeof data.session})`);
        console.log(`- Counts:`, JSON.stringify(data.counts));
        console.log("-------------------");
    });
}

inspectRecords();
