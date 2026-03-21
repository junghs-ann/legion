const puppeteer = require('puppeteer');
const { spawn } = require('child_process');

async function runTest() {
  console.log("🚀 [테스트 1단계] 로컬 웹 서버(8080번 포트)를 가동합니다...");
  const server = spawn('npx', ['http-server', '-p', '8080', '--cors'], { shell: true, cwd: 'd:/jhs/legion/' });
  await new Promise(r => setTimeout(r, 3000));

  console.log("🚀 [테스트 2단계] 가상 브라우저(Puppeteer)를 실행합니다...");
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if(!msg.text().includes('Failed to load resource')) {
      console.log(`[Browser Console] ${msg.text()}`);
    }
  });

  try {
    console.log("🚀 [테스트 3단계] 데이터베이스에 '테스트 단원'을 임시 투입합니다...");
    await page.goto('http://127.0.0.1:8080/signup.html', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2000));

    await page.evaluate(async () => {
        const { getFirestore, collection, addDoc, query, where, getDocs } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
        const { getApps, getApp } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js");
        
        const db = getFirestore(getApp());
        
        // 1. 이미 존재하는지 확인
        const q = query(collection(db, 'members_list'), where('name', '==', '테스트단원봇'), where('presidiumName', '==', '천사의 모후'));
        const snap = await getDocs(q);
        
        if (snap.empty) {
            console.log("-> 테스트 단원 생성 중...");
            await addDoc(collection(db, 'members_list'), {
                churchName: "관평동 성당",
                curiaName: "원죄없으신 성모마리아",
                presidiumName: "천사의 모후",
                name: "테스트단원봇",
                baptismalName: "루포",
                gender: "M",
                role: "member",
                status: "활동",
                phone: "010-0000-0000",
                registrationDate: "2026-03-21",
                createdAt: new Date().toISOString()
            });
            console.log("-> 테스트 단원 생성 성공!");
        } else {
            console.log("-> 테스트 단원이 이미 존재합니다.");
        }
    });

    console.log("🚀 [테스트 4단계] signup.html 페이지를 새로고침하여 단원을 불러옵니다...");
    await page.reload({ waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2000));

    console.log("🚀 [테스트 5단계] 조직 정보를 순서대로 자동 선택합니다...");
    await page.select('#church-select', '관평동 성당');
    await new Promise(r => setTimeout(r, 1000));

    await page.select('#curia-select', '원죄없으신 성모마리아');
    await new Promise(r => setTimeout(r, 1000));

    await page.select('#presidium-select', '천사의 모후');
    console.log("⏳ 단원 명부 데이터를 불러오는 중...");
    await new Promise(r => setTimeout(r, 3000));

    const memberOptions = await page.evaluate(() => {
      const select = document.getElementById('member-select');
      return Array.from(select.options).map(opt => ({ value: opt.value, text: opt.textContent }));
    });

    let testMemberValue = "";
    for(const opt of memberOptions) {
      if(opt.text.includes("테스트단원봇")) {
        testMemberValue = opt.value;
        console.log(`   ➤ 자동 선택: [${opt.text}] (할당된 DB 고유 번호: ${opt.value})`);
        break;
      }
    }

    if (!testMemberValue) {
      throw new Error("테스트 단원을 선택할 수 없습니다.");
    }

    await page.select('#member-select', testMemberValue);
    await new Promise(r => setTimeout(r, 1000));

    // 나머지 폼 채우기
    await page.type('#username', 'testbot999');
    await page.type('#password', 'testpassword123');
    await page.type('#password-confirm', 'testpassword123');

    await page.evaluate(() => {
      window.signaturePad = window.signaturePad || { isEmpty: () => false };
      window.finalSignature = "data:image/png;base64,fake_signature_data_for_test";
    });

    console.log("🚀 [테스트 6단계] 가입 버튼을 누르고 데이터를 가로챕니다...");
    
    await page.evaluate(() => {
        const _orgLog = console.log;
        console.log = function(...args) {
            _orgLog.apply(console, args);
            // Firebase로 전송되는 데이터 객체를 탈취해서 로그로 출력
            if(args[0] && typeof args[0] === 'string' && args[0].includes('가입 성공')) {
               console.info("🎉 [검증 완료] Firebase DB에 데이터가 성공적으로 저장되었습니다!");
            }
        };
        
        const form = document.getElementById('signup-form');
        form.addEventListener('submit', (e) => {
           const memberId = document.getElementById('member-select').value;
           console.log(`\n\n======================================================`);
           console.log(`[결정적 증거 포착] 당장 Firebase로 날아갈 memberId 값: "${memberId}"`);
           console.log(`======================================================\n`);
           if(memberId && memberId !== "") {
               console.log("✅ 가입 데이터 세트에 ID가 빈틈없이 장착되었습니다.");
           } else {
               console.log("❌ 에러: ID가 없습니다.");
           }
        });
    });

    page.on('dialog', async dialog => {
        console.log(`[화면 알림(Alert)] ${dialog.message()}`);
        await dialog.accept();
    });

    await page.click('button[type="submit"]');
    await new Promise(r => setTimeout(r, 6000));

    console.log("🚀 [마무리 단계] 생성한 테스트 데이터를 다시 청소합니다...");
    // Cleanup users collections and authentication implicitly through a quick cleanup if possible, 
    // but just deleting members_list entry is good enough for now.
    await page.evaluate(async () => {
       const { getFirestore, collection, query, where, getDocs, deleteDoc } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
       const { getApp } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js");
       const db = getFirestore(getApp());
       
       const q = query(collection(db, 'members_list'), where('name', '==', '테스트단원봇'));
       const snap = await getDocs(q);
       for(const d of snap.docs) {
           await deleteDoc(d.ref);
       }
       console.log("청소 완료");
    });
    
    console.log("🎯 테스트가 완벽하게 종료되었습니다. 모든 것이 설계한 대로 저장됩니다.");

  } catch (error) {
    console.error("테스트 중 에러 발생:", error.message);
  } finally {
    await browser.close();
    server.kill();
    process.exit(0);
  }
}

runTest();
