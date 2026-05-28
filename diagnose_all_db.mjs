import { db, collection, getDocs } from "./firebase-config.js";

async function run() {
    console.log("==========================================");
    console.log("🚀 Firestore 전수 조사 및 실시간 데이터 매핑");
    console.log("==========================================");

    try {
        // 1. 쁘레시디움 목록 (presidia_list)
        console.log("\n📁 [1] presidia_list (쁘레시디움 목록) 전체 조회");
        const presidiaSnap = await getDocs(collection(db, "presidia_list"));
        let pCount = 0;
        presidiaSnap.forEach(d => {
            const data = d.data();
            console.log(`  - 문서ID: [${d.id}] | 성당: ${data.churchName || '-'} | 꾸리아: ${data.curiaName || '-'} | 쁘레시디움: ${data.presidiumName || '-'}`);
            pCount++;
        });
        console.log(`👉 총 쁘레시디움 수: ${pCount}개`);

        // 2. 단원 명부 (members_list)
        console.log("\n📁 [2] members_list (단원 명부) 전체 조회");
        const membersSnap = await getDocs(collection(db, "members_list"));
        let mCount = 0;
        membersSnap.forEach(d => {
            const data = d.data();
            console.log(`  - 문서ID: [${d.id}] | 성명: ${data.name || '-'} | 세례명: ${data.baptismalName || '-'} | 상태: ${data.status || '-'} | 소속: ${data.churchName || '-'} ➡️ ${data.presidiumName || '-'}`);
            mCount++;
        });
        console.log(`👉 총 단원 수: ${mCount}명`);

        // 3. 회원 가입 계정 (users)
        console.log("\n📁 [3] users (회원 가입 계정) 전체 조회");
        const usersSnap = await getDocs(collection(db, "users"));
        let uCount = 0;
        usersSnap.forEach(d => {
            const data = d.data();
            console.log(`  - 문서ID: [${d.id}] | 성명: ${data.name || '-'} | 역할: ${data.role || '-'} | 이메일: ${data.email || '-'} | 소속: ${data.churchName || '-'} ➡️ ${data.presidiumName || '-'}`);
            uCount++;
        });
        console.log(`👉 총 가입 계정 수: ${uCount}개`);

        // 4. 간부 임기 이력 (officers_list)
        console.log("\n📁 [4] officers_list (간부 임기 이력) 전체 조회");
        const officersSnap = await getDocs(collection(db, "officers_list"));
        let oCount = 0;
        officersSnap.forEach(d => {
            const data = d.data();
            console.log(`  - 문서ID: [${d.id}] | 성명: ${data.name || '-'} | 직급: ${data.role || '-'} | 소속: ${data.churchName || '-'} ➡️ ${data.presidiumName || '-'}`);
            oCount++;
        });
        console.log(`👉 총 간부 이력 수: ${oCount}개`);

    } catch (e) {
        console.error("🚨 전수 조사 실패: ", e.message);
    }
    console.log("\n==========================================");
    process.exit(0);
}

run();
