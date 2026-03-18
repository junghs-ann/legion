
import { db, doc, updateDoc } from "./firebase-config.js";

async function fixRole() {
    const userRef = doc(db, 'users', 'jhs0121');
    try {
        await updateDoc(userRef, {
            role: '단장'
        });
        console.log("Successfully updated jhs0121 role to '단장'");
    } catch (e) {
        console.error("Error updating role:", e);
    }
}
fixRole();
