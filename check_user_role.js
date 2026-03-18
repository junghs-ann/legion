
import { db, doc, getDoc } from "./firebase-config.js";

async function checkUser() {
    const userDoc = await getDoc(doc(db, 'users', 'jhs0121'));
    if (userDoc.exists()) {
        console.log("User Profile for jhs0121:", userDoc.data());
    } else {
        console.log("User jhs0121 not found in 'users' collection.");
    }
}
checkUser();
