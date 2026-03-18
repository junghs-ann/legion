
import { db, doc, getDoc } from './firebase-config.js';

async function check() {
    try {
        const snap = await getDoc(doc(db, 'users', 'jhs0121'));
        if (snap.exists()) {
            console.log("RAW_DATA_START");
            console.log(JSON.stringify(snap.data(), null, 2));
            console.log("RAW_DATA_END");
        } else {
            console.log("USER_NOT_FOUND");
        }
    } catch (e) {
        console.error("ERROR:", e.message);
    }
    process.exit(0);
}

check();
