
import { db, collection, getDocs, query, where } from './firebase-config.js';

async function dumpData() {
    const church = "관평동 성당";
    const presidium = "천사의 모후";

    console.log(`--- Officers List for ${presidium} ---`);
    const ofSnap = await getDocs(collection(db, 'officers_list'));
    ofSnap.forEach(doc => {
        const d = doc.data();
        if ((d.churchName === church || d.church === church) && (d.presidiumName === presidium || d.presidium === presidium)) {
            console.log(JSON.stringify({id: doc.id, ...d}, null, 2));
        }
    });

    console.log(`\n--- Members List for ${presidium} ---`);
    const memSnap = await getDocs(collection(db, 'members_list'));
    memSnap.forEach(doc => {
        const d = doc.data();
        if ((d.churchName === church || d.church === church) && (d.presidiumName === presidium || d.presidium === presidium)) {
            if (d.name === "김영숙" || d.name === "유주연") {
                console.log(JSON.stringify({id: doc.id, ...d}, null, 2));
            }
        }
    });

    console.log("\n--- End of Dump ---");
    process.exit(0);
}

dumpData();
