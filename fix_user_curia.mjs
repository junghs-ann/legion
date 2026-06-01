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
    console.log("Starting user profile curia repair...");
    
    // jhs0121 문서의 curiaName을 "원죄없으신 성모마리아"로 업데이트합니다.
    const targetUid = "jhs0121";
    const correctCuria = "원죄없으신 성모마리아";
    
    console.log(`Updating user ${targetUid} curiaName to "${correctCuria}"...`);
    
    const docRef = doc(db, 'users', targetUid);
    await updateDoc(docRef, {
        curiaName: correctCuria
    });
    
    console.log("✅ User profile repair complete!");
}

run().then(() => process.exit(0)).catch(err => {
    console.error("🚨 User repair failed:", err);
    process.exit(1);
});
