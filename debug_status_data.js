
import { db, collection, getDocs } from "./firebase-config.js";

async function listStatus() {
    const snap = await getDocs(collection(db, 'business_report_status'));
    console.log("=== business_report_status documents ===");
    snap.forEach(doc => {
        console.log(doc.id, doc.data());
    });
}
listStatus();
