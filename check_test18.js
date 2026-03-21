const { initializeApp } = require('firebase/app');
const { getFirestore, collection, query, where, getDocs } = require('firebase/firestore');

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

async function checkUser() {
    console.log("🔍 'test18' 계정 데이터베이스 조회 중...");
    const q = query(collection(db, 'users'), where('username', '==', 'test18'));
    const snap = await getDocs(q);
    
    if (snap.empty) {
        // 이름으로도 검색 시도
        const q2 = query(collection(db, 'users'), where('name', '==', 'test18'));
        const snap2 = await getDocs(q2);
        if (snap2.empty) {
            console.log("❌ 'test18' 계정을 찾을 수 없습니다.");
            process.exit(0);
        } else {
            snap2.forEach(doc => {
                const data = doc.data();
                console.log(`\n✅ [조회 성공] UID: ${doc.id}`);
                console.log(`- 가입 성명: ${data.name}`);
                console.log(`- 가입 계정: ${data.username}`);
                console.log(`- 부여된 단원 명부 ID (memberId): "${data.memberId}"\n`);
                if (data.memberId && data.memberId.trim() !== "") {
                    console.log("🎯 [검증 통과] memberId가 정상적으로 발급되어 저장되었습니다!");
                } else {
                    console.log("⚠️ [오류 발견] memberId가 비어있습니다.");
                }
            });
        }
    } else {
        snap.forEach(doc => {
            const data = doc.data();
            console.log(`\n✅ [조회 성공] UID: ${doc.id}`);
            console.log(`- 가입 성명: ${data.name}`);
            console.log(`- 가입 계정: ${data.username}`);
            console.log(`- 부여된 단원 명부 ID (memberId): "${data.memberId}"\n`);
            if (data.memberId && data.memberId.trim() !== "") {
                console.log("🎯 [검증 통과] memberId가 정상적으로 발급되어 저장되었습니다!");
            } else {
                console.log("⚠️ [오류 발견] memberId가 비어있습니다.");
            }
        });
    }
    process.exit(0);
}

checkUser().catch(console.error);
