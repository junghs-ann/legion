
import { db, collection, query, where, getDocs } from './firebase-config.js';

async function findTheTruth() {
    const pr = '천사의 모후';
    const date = '2026-01-06';
    
    console.log(`\n🔍 [데이터 진실 탐사] 쁘레시디움: ${pr}, 날짜: ${date}`);
    console.log("--------------------------------------------------");

    try {
        // 모든 활동 기록을 가져옵니다 (필터 없이 일단 다 가져온 뒤 수동 필터링)
        const snap = await getDocs(collection(db, 'activity_records'));
        
        let foundCount = 0;
        snap.forEach(doc => {
            const data = doc.data();
            // 쁘레시디움 이름(신/구)과 날짜가 일치하는 것만 추출
            const isPrMatch = (data.presidiumName === pr);
            const isDateMatch = (data.date === date);

            if (isPrMatch && isDateMatch) {
                foundCount++;
                console.log(`\n📄 발견된 문서 [${foundCount}]`);
                console.log(`   - 문서 ID: ${doc.id}`);
                console.log(`   - 성명: ${data.memberName}`);
                console.log(`   - 날짜: ${data.date} / 회차: ${data.session}`);
                console.log(`   - 활동 수치(counts): ${JSON.stringify(data.counts)}`);
                console.log(`   - 이름표 필드: presidiumName:${data.presidiumName}, presidium:${data.presidium}`);
            }
        });

        if (foundCount === 0) {
            console.log("❌ 해당 조건과 일치하는 데이터가 DB에 하나도 없습니다.");
        } else {
            console.log(`\n✅ 총 ${foundCount}개의 레코드를 찾았습니다.`);
            console.log("이 목록 중에 화면에는 안 나오지만 숫자를 갉아먹는 '유령'이 있는지 확인해 보세요.");
        }
    } catch (error) {
        console.error("❌ 데이터 조회 중 오류 발생:", error);
    }
}

findTheTruth();
