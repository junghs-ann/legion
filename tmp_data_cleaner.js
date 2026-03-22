
import { db } from './firebase-config.js';
import { collection, getDocs, doc, updateDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

async function cleanData() {
    console.log("=== [데이터 클리닝 시작] '정혜숙' 단원 성명 공백 제거 ===");
    
    try {
        const aSnap = await getDocs(collection(db, 'activity_records'));
        let updateCount = 0;
        let totalProcessed = 0;

        for (const recordDoc of aSnap.docs) {
            const data = recordDoc.data();
            totalProcessed++;
            
            // '정혜숙'이라는 글자가 포함되어 있고, 앞뒤 공백이 있는 경우에만 처리
            const originalName = data.memberName || "";
            if (originalName.includes('정혜숙') && originalName !== originalName.trim()) {
                const cleanedName = originalName.trim();
                
                // Firestore 문서 업데이트
                const recordRef = doc(db, 'activity_records', recordDoc.id);
                await updateDoc(recordRef, {
                    memberName: cleanedName
                });
                
                updateCount++;
                if (updateCount <= 5) {
                    console.log(`[업데이트 완료] ID: ${recordDoc.id}, "${originalName}" -> "${cleanedName}"`);
                }
            }
        }
        
        console.log(`\n=== [클리닝 완료] ===`);
        console.log(`- 전체 검사 기록: ${totalProcessed}건`);
        console.log(`- 수정된 기록: ${updateCount}건`);
        console.log(`이제 활동 내역 화면에서 공백 없이 깔끔하게 나오는지 확인해 보세요!`);
        
    } catch (e) {
        console.error("클리닝 중 오류 발생:", e);
    }
}

cleanData();
