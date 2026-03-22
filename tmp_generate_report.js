
import { db } from './firebase-config.js';
import { collection, getDocs } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

async function generateFullReport() {
    console.log("Generating full report...");
    try {
        const result = [];
        const mSnap = await getDocs(collection(db, 'members_list'));
        mSnap.forEach(doc => {
            result.push({ type: '단원', name: doc.data().name || "", baptismal: doc.data().baptismalName || "" });
        });
        const oSnap = await getDocs(collection(db, 'officers_list'));
        oSnap.forEach(doc => {
            result.push({ type: '간부', name: doc.data().name || "", baptismal: doc.data().baptismalName || "" });
        });

        // 결과 정렬
        result.sort((a, b) => a.name.localeCompare(b.name));

        let md = "# [전수 조사] 전체 단원 및 간부 성명 리스트\n\n";
        md += "이 리스트는 현재 DB(Master Data)에 등록된 모든 인원의 성함을 보여줍니다. 성함 앞뒤에 공백이 있는지 확인하기 위해 따옴표(`\" \"`)를 붙여 표시했습니다.\n\n";
        md += "| 유형 | 성함 (공백 확인용) | 세례명 | 상태 |\n";
        md += "| :--- | :--- | :--- | :--- |\n";
        
        result.forEach(r => {
            const hasSpace = r.name !== r.name.trim();
            md += `| ${r.type} | \`"${r.name}"\` | ${r.baptismal} | ${hasSpace ? "⚠️ 공백 있음" : "✅ 정상"} |\n`;
        });

        console.log("REPORT_MD_START");
        console.log(md);
        console.log("REPORT_MD_END");
    } catch (e) {
        console.error(e);
    }
}
generateFullReport();
