import { db, collection, getDocs } from "./firebase-config.js";

async function checkDuplicates() {
    console.log("🚀 단원 명부(`members_list`) 중복 데이터 정밀 진단 시작...");
    const snap = await getDocs(collection(db, 'members_list'));
    const members = [];
    snap.forEach(doc => members.push({ id: doc.id, ...doc.data() }));

    const stats = {};
    const duplicates = [];

    members.forEach(m => {
        const key = `${m.churchName}_${m.presidiumName}_${m.name}_${m.baptismalName}`;
        if (!stats[key]) {
            stats[key] = [];
        }
        stats[key].push(m.id);
    });

    for (const key in stats) {
        if (stats[key].length > 1) {
            duplicates.push({
                key: key,
                ids: stats[key]
            });
        }
    }

    if (duplicates.length > 0) {
        console.log(`⚠️ 총 ${duplicates.length}건의 중복 그룹이 발견되었습니다.`);
        duplicates.forEach(d => {
            console.log(`[중복] ${d.key} -> 문서 ID들: ${d.ids.join(', ')}`);
        });
    } else {
        console.log("✅ 축하합니다! 현재 데이터베이스에 성명/세례명이 완벽히 일치하는 중복 데이터는 없습니다.");
    }
}

checkDuplicates();
