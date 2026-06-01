import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

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
    console.log("Starting users scan...");
    
    const uSnap = await getDocs(collection(db, 'users'));
    console.log("\n=== ALL USERS IN DATABASE ===");
    let count = 0;
    uSnap.forEach(d => {
        const u = d.data();
        console.log(`[UID: ${d.id}] 이름: ${u.name} | 권한: ${u.role} | 성당: "${u.churchName}" | 꾸리아: "${u.curiaName}" | 쁘레시디움: "${u.presidiumName}" | 이메일: ${u.email}`);
        count++;
    });
    console.log(`Total users count: ${count}`);
}

run().then(() => process.exit(0)).catch(err => {
    console.error(err);
    process.exit(1);
});
