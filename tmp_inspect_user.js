
import { db, doc, getDoc, collection, query, where, getDocs } from "./firebase-config.js";

async function inspectUser() {
    console.log("=== User Profile Inspection ===");
    const userDoc = await getDoc(doc(db, "users", "jhs0121"));
    if (userDoc.exists()) {
        console.log("User profile:", JSON.stringify(userDoc.data(), null, 2));
    } else {
        console.log("User jhs0121 NOT FOUND in users collection");
    }

    console.log("\n=== Officer Entry Inspection ===");
    const offSnap = await getDocs(query(collection(db, "officers_list"), where("name", "==", "정혜숙")));
    offSnap.forEach(d => {
        console.log(`Officer Found: ${d.id} =>`, JSON.stringify(d.data(), null, 2));
    });
}

inspectUser();
