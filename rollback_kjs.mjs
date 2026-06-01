import { initializeApp } from "firebase/app";
import { getFirestore, doc, updateDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyA64eMVDXBQ80UHIVU58gueRukmwjQDZ5g",
    authDomain: "legion-f319a.firebaseapp.com",
    projectId: "legion-f319a",
    storageBucket: "legion-f319a.firebasestorage.app",
    messagingSenderId: "852854704608",
    appId: "1:852854704608:web:f9fbb0962bdcea3c538385",
    measurementId: "G-EB89J6Z3K0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
    console.log("Rolling back Kim Ji-soo expiry date to empty...");
    
    const targetId = "off_1779779958771";
    
    const docRef = doc(db, 'officers_list', targetId);
    await updateDoc(docRef, {
        appointmentExpiryDate: ""
    });
    
    console.log("✅ Rollback complete! Kim Ji-soo is now active treasurer again.");
}

run().then(() => process.exit(0)).catch(err => {
    console.error("🚨 Rollback failed:", err);
    process.exit(1);
});
