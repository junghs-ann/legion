
import { db, doc, updateDoc } from "./firebase-config.js";

async function fixUserProfile() {
    const userRef = doc(db, 'users', 'jhs0121');
    try {
        await updateDoc(userRef, {
            churchName: '관평동 성당',
            role: '단장'
        });
        console.log("Successfully updated jhs0121: churchName='관평동 성당', role='단장'");
    } catch (e) {
        console.error("Error updating user profile:", e);
    }
}
fixUserProfile();
