import { db, collection, getDocs } from "./firebase-config.js";

async function listRegisteredChurches() {
    console.log("Registered Churches in activity_schemas:");
    const snap = await getDocs(collection(db, 'activity_schemas'));
    const churches = [];
    snap.forEach(doc => {
        const data = doc.data();
        const name = data.churchName || (data.church ? data.church + " (Legacy)" : "Unknown");
        churches.push({ id: doc.id, name: name });
    });
    console.log(JSON.stringify(churches, null, 2));
}

listRegisteredChurches().then(() => process.exit(0)).catch(err => {
    console.error(err);
    process.exit(1);
});
