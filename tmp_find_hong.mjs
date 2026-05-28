import { db, collection, getDocs, query, where } from "./firebase-config.js";

async function run() {
    try {
        const q = query(collection(db, "users"), where("name", "==", "홍길동"));
        const snap = await getDocs(q);
        if (snap.empty) {
            console.log("홍길동 사용자를 찾을 수 없습니다.");
        } else {
            snap.forEach(doc => {
                console.log(`성명: ${doc.data().name}, 이메일: ${doc.data().email || '없음'}, ID: ${doc.data().username || '없음'}, UID: ${doc.id}`);
            });
        }
    } catch (e) {
        console.error(e);
    }
    process.exit(0);
}
run();
