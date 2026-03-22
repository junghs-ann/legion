
import { db } from './firebase-config.js';
import { collection, getDocs, doc, updateDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

async function deepAuditAndClean() {
    console.log("=== [정밀 진단 및 강제 클리닝 시작] ===");
    
    try {
        const aSnap = await getDocs(collection(db, 'activity_records'));
        let updateCount = 0;

        for (const recordDoc of aSnap.docs) {
            const data = recordDoc.data();
            const originalName = data.memberName || "";
            
            if (originalName.includes('정혜숙')) {
                // 1. 상세 분석 (코드값 출력)
                let charCodes = [];
                for(let i=0; i<originalName.length; i++) {
                    charCodes.push(originalName.charCodeAt(i));
                }
                console.log(`[분석] ID: ${recordDoc.id}, 원본: "${originalName}", 코드: [${charCodes.join(', ')}]`);

                // 2. 강력한 클리닝 (모든 종류의 공백 및 제어문자 제거)
                // \s: 스페이스, 탭, 줄바꿈 등
                // \u00A0: Non-breaking space 등
                const cleanedName = originalName.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
                
                if (originalName !== cleanedName) {
                    const recordRef = doc(db, 'activity_records', recordDoc.id);
                    await updateDoc(recordRef, {
                        memberName: cleanedName
                    });
                    updateCount++;
                    console.log(`   ㄴ> [강제 업데이트!] "${originalName}" -> "${cleanedName}"`);
                }
            }
        }
        
        // members_list도 동일하게 정밀 체크
        const mSnap = await getDocs(collection(db, 'members_list'));
        for (const mDoc of mSnap.docs) {
            const data = mDoc.data();
            const name = data.name || "";
            if (name.includes('정혜숙')) {
                const cleaned = name.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
                if (name !== cleaned) {
                    await updateDoc(doc(db, 'members_list', mDoc.id), { name: cleaned });
                    console.log(`[단원명부 업데이트] ID: ${mDoc.id}, "${name}" -> "${cleaned}"`);
                }
            }
        }

        console.log(`\n총 ${updateCount}건의 활동 기록을 강제 클리닝했습니다.`);
    } catch (e) {
        console.error("오류 발생:", e);
    }
}

deepAuditAndClean();
