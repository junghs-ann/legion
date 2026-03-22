
import { db } from './firebase-config.js';
import { collection, getDocs, query, where } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

async function auditNames() {
    console.log("=== [전수 조사] 성명 공백 및 데이터 정합성 체크 ===");
    
    try {
        // 1. members_list 전수 조사
        const mSnap = await getDocs(collection(db, 'members_list'));
        const membersWithSpace = [];
        const allMemberNames = [];
        
        mSnap.forEach(doc => {
            const name = doc.data().name || "";
            allMemberNames.push(name);
            if (name !== name.trim()) {
                membersWithSpace.push({ id: doc.id, name: `"${name}"` });
            }
        });
        
        console.log(`\n[단원 명부(members_list)]`);
        console.log(`- 전체 단원 수: ${allMemberNames.length}명`);
        if (membersWithSpace.length > 0) {
            console.log(`- 공백 발견 단원 (${membersWithSpace.length}명):`);
            membersWithSpace.forEach(m => console.log(`  > ID: ${m.id}, 성함: ${m.name}`));
        } else {
            console.log(`- 모든 단원의 성함이 깨끗합니다(공백 없음).`);
        }

        // 2. '정혜숙' 단원 집중 추적 (모든 컬렉션)
        console.log(`\n['정혜숙' 단원 데이터 스냅샷 추적]`);
        
        // activity_records에서 '정혜숙' 포함된 모든 기록 조회
        const aSnap = await getDocs(collection(db, 'activity_records'));
        let recordCount = 0;
        let recordWithSpace = 0;
        
        aSnap.forEach(doc => {
            const data = doc.data();
            if ((data.memberName || "").includes('정혜숙')) {
                recordCount++;
                if (data.memberName !== data.memberName.trim()) {
                    recordWithSpace++;
                    if (recordWithSpace <= 3) {
                        console.log(`  > [활동기록] 회차: ${data.session}, 날짜: ${data.date}, 저장된성함: "${data.memberName}" (공백있음)`);
                    }
                }
            }
        });
        
        console.log(`- '정혜숙' 관련 전체 활동 기록: ${recordCount}건`);
        console.log(`- 그 중 공백이 포함된 채 저장된 기록: ${recordWithSpace}건`);
        
        console.log(`\n[결론 및 조언]`);
        console.log(`활동 내역 화면은 'ID'로 단원을 찾아오지만, 화면에 보여주는 '이름'은 기록 당시 저장된 값을 보여줍니다.`);
        console.log(`단원 관리에서 수정한 것은 '현재 명부'일 뿐, '과거 활동 기록'에 이미 저장된 이름까지 자동으로 바뀌지는 않습니다.`);
        console.log(`과거 기록의 이름을 일괄 수정하는 '데이터 클리닝' 작업이 필요해 보입니다.`);

    } catch (e) {
        console.error("진행 중 오류 발생:", e);
    }
}

auditNames();
