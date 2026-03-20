import { db, collection, getDocs } from "./firebase-config.js";

async function checkNotices() {
    console.log("Checking legion_notices_list...");
    const q = collection(db, 'legion_notices_list');
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
        console.log("No notices found in the collection.");
        return;
    }

    querySnapshot.forEach(doc => {
        const data = doc.data();
        console.log(`Doc ID: ${doc.id}, Title: ${data.title}, ID Field: ${data.id}, CreatedAt: ${data.createdAt ? data.createdAt.toDate() : 'N/A'}`);
    });
}

checkNotices();
