
const admin = require('firebase-admin');

// 1. Firebase 관리자 권한으로 프로젝트 연결
const serviceAccount = undefined; // 로컬 환경의 Application Default Credentials 사용 유도

try {
  admin.initializeApp({
    projectId: 'h-legion-7fe9c' // 사용자 프로젝트 ID
  });
} catch (e) {
  // 이미 로드된 경우 무시
}

const db = admin.firestore();

async function checkBrokenData() {
  console.log("🔍 [데이터 ID 누락 실태 전수 조사 시작]...");
  
  // 1. 명부의 모든 데이터를 가져옴 (기준점)
  const memberSnap = await db.collection('members_list').get();
  const members = {};
  memberSnap.forEach(doc => {
    const data = doc.data();
    members[doc.id] = { id: doc.id, ...data };
  });

  // 2. 가입된 모든 사용자 계정을 가져옴 (비교 대상)
  const userSnap = await db.collection('users').get();
  const brokenUsers = [];
  const validUsers = [];
  const mismatchedUsers = [];

  userSnap.forEach(doc => {
    const u = { uid: doc.id, ...doc.data() };
    const name = u.name || u.memberName;
    
    // [판정 1] memberId 필드 자체가 없는 경우 (완전 단절)
    if (!u.memberId) {
      brokenUsers.push(u);
    } 
    // [판정 2] memberId는 있으나, 명부(members_list)에 해당 ID가 존재하지 않는 경우
    else if (!members[u.memberId]) {
      mismatchedUsers.push(u);
    }
    // [판정 3] 정상 연결된 경우
    else {
      validUsers.push(u);
    }
  });

  console.log(`\n========================================`);
  console.log(`📊 데이터 요약 (백업 제외 실시간 데이터 기준)`);
  console.log(`- 전체 가입 계정: ${userSnap.size}개`);
  console.log(`- 정상 연결 계정 (memberId 정상): ${validUsers.length}개`);
  console.log(`- ❌ ID 누락 계정 (memberId 필드 없음): ${brokenUsers.length}개`);
  console.log(`- ⚠️ ID 불일치 계정 (명부에 없는 memberId): ${mismatchedUsers.length}개`);
  console.log(`========================================\n`);

  if (brokenUsers.length > 0) {
    console.log(`[분석사유 1: memberId 필드가 완전히 누락된 사례 (상위 5명)]`);
    brokenUsers.slice(0, 5).forEach(u => {
      console.log(`- 성명: ${u.name || u.memberName}, 성당: ${u.churchName}, 등록일: ${u.createdAt || u.regDate || '-'}`);
    });
    console.log(`=> 사유: 회원가입 시점에 명부 연결에 실패했거나, '재입단/수정' 과정에서 ID를 보존하지 못하고 누락시킴.`);
  }

  if (mismatchedUsers.length > 0) {
    console.log(`\n[분석사유 2: memberId는 존재하나 명부(members_list)와 매칭되지 않는 사례 (상위 5명)]`);
    mismatchedUsers.slice(0, 5).forEach(u => {
      console.log(`- 성명: ${u.name || u.memberName}, 기록된ID: ${u.memberId}, 계정UID: ${u.uid}`);
    });
    console.log(`=> 사유: 명부 데이터가 삭제되었거나, 다른 명부 데이터가 덮어씌워져 ID 단절 발생.`);
  }
}

checkBrokenData()
  .then(() => {
    console.log("\n🚀 조사가 완료되었습니다.");
    process.exit(0);
  })
  .catch(err => {
    console.error("❌ 조사 중 오류:", err);
    process.exit(1);
  });
