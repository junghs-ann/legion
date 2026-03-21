const admin = require('firebase-admin');

// Firebase 프로젝트 ID 설정
const projectId = 'h-legion-7fe9c';

try {
  admin.initializeApp({
    projectId: projectId
  });
} catch (e) {
  // 이미 로드된 경우 무시
}

const db = admin.firestore();

async function showBrokenUsers() {
  console.log(`\n🔍 [실시간 사용자 계정(users) 전수 조사 시작]...`);
  
  const userSnap = await db.collection('users').get();
  let totalCount = userSnap.size;
  let missingCount = 0;
  let mismatchedCount = 0;

  // 명부(members_list) 데이터 로드 (매칭 확인용)
  const memberSnap = await db.collection('members_list').get();
  const members = {};
  memberSnap.forEach(doc => {
    members[doc.id] = doc.data();
  });

  console.log(`- 전체 가입 계정 수: ${totalCount}개`);
  console.log(`----------------------------------------`);
  console.log(`[ID 누락/단절 사례 목록]`);

  userSnap.forEach(doc => {
    const u = doc.data();
    const uid = doc.id;
    const name = u.name || u.memberName || '이름없음';

    // 1. memberId 필드가 아예 없는 경우
    if (!u.memberId) {
      missingCount++;
      console.log(`❌ [누락] 성명: ${name.padEnd(6, ' ')} | UID: ${uid} | 성당: ${u.churchName || '-'}`);
    } 
    // 2. memberId가 있지만 명부에 없는 경우
    else if (!members[u.memberId]) {
      mismatchedCount++;
      console.log(`⚠️ [단절] 성명: ${name.padEnd(6, ' ')} | 기록된ID: ${u.memberId.padEnd(20, ' ')} | 명부에 존재하지 않음`);
    }
  });

  console.log(`----------------------------------------`);
  console.log(`📌 결과 요약:`);
  console.log(`- memberId 필드 누락: ${missingCount}건`);
  console.log(`- 명부 ID 불일치(단절): ${mismatchedCount}건`);
  console.log(`- 정상적으로 연결된 계정: ${totalCount - missingCount - mismatchedCount}건`);
  console.log(`========================================\n`);
}

showBrokenUsers()
  .then(() => process.exit(0))
  .catch(err => {
    console.error("❌ 조사 중 오류 발생:", err);
    process.exit(1);
  });
