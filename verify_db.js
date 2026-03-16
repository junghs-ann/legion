const https = require('https');

/**
 * [긴급 진단] Firestore REST API를 이용한 단원 목록 조회 스크립트
 * 별도의 라이브러리 설치 없이 node verify_db.js 명령으로 실행 가능합니다.
 */

const PROJECT_ID = 'legion-f319a';
const COLLECTION = 'members_list';
const URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${COLLECTION}`;

console.log(`\n🔍 [DB 조회 시작] 프로젝트: ${PROJECT_ID}, 컬렉션: ${COLLECTION}`);
console.log(`------------------------------------------------------------------`);

https.get(URL, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            if (json.documents && json.documents.length > 0) {
                console.log(`✅ 총 ${json.documents.length}건의 데이터를 발견했습니다!\n`);
                
                json.documents.forEach((doc, index) => {
                    const fields = doc.fields;
                    const name = fields.name ? fields.name.stringValue : '이름없음';
                    const church = fields.churchName ? fields.churchName.stringValue : (fields.church ? fields.church.stringValue : '성당미정');
                    const pr = fields.presidiumName ? fields.presidiumName.stringValue : (fields.presidium ? fields.presidium.stringValue : 'Pr미정');
                    const createdAt = fields.createdAt ? fields.createdAt.timestampValue : 'N/A';
                    
                    console.log(`[${index + 1}] 성명: ${name}`);
                    console.log(`    소속: ${church} / ${pr}`);
                    console.log(`    등록일: ${createdAt}`);
                    console.log(`    문서ID: ${doc.name.split('/').pop()}`);
                    console.log(`--------------------------------------------------`);
                });
            } else {
                console.log('❌ DB가 비어있습니다. (0건 발견)');
                console.log('이유 1: 아직 데이터가 성공적으로 전송되지 않았음');
                console.log('이유 2: 콜렉션 명칭(members_list)이 서버와 다름');
                // console.log('상세 응답:', data); // 디버깅용
            }
        } catch (e) {
            console.error('데이터 해석 중 오류:', e.message);
            console.log('서버 응답:', data);
        }
    });
}).on('error', (err) => {
    console.error('통신 오류:', err.message);
});
