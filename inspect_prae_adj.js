
import { db } from "./firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

async function inspectCollections() {
    const collections = ['praetorium_list', 'adjutorium_members_list'];
    for (const collName of collections) {
        console.log(`--- ${collName} ---`);
        const snap = await getDocs(collection(db, collName));
        if (snap.empty) {
            console.log("Empty collection.");
        } else {
            const data = snap.docs[0].data();
            console.log("First document sample:", JSON.stringify(data, null, 2));
            console.log(`Total documents: ${snap.size}`);
        }
    }
}

inspectCollections();
