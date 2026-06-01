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
    console.log("Starting DB repair for officer conflict...");
    
    // 김지수 회계의 기존 만료되지 않은 문서 ID: off_1779779958771
    // 권혜진 회계의 임명일이 2015-04-21 이므로, 김지수 회계의 만료일을 2015-04-20으로 수정합니다.
    const targetId = "off_1779779958771";
    const expiryDate = "2015-04-20";
    
    console.log(`Updating officer doc ${targetId} expiry date to ${expiryDate}...`);
    
    const docRef = doc(db, 'officers_list', targetId);
    await updateDoc(docRef, {
        appointmentExpiryDate: expiryDate
    });
    
    console.log("✅ Repair complete!");
}

run().then(() => process.exit(0)).catch(err => {
    console.error("🚨 Repair failed:", err);
    process.exit(1);
});
