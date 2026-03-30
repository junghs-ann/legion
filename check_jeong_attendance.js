import { db } from "./firebase-config.js";
import { collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

async function checkAttendance() {
    console.log("🚀 출석 데이터 조회 중...");
    try {
        const snap = await getDocs(query(collection(db, 'attendance_list')));
        const records = [];
        
        snap.forEach(doc => {
            const data = doc.data();
            // find ones where someone named '정혜숙' is in attendanceData
            let hasJeong = false;
            if (data.attendanceData) {
                for (let key in data.attendanceData) {
                    if (data.attendanceData[key].name && data.attendanceData[key].name.includes('정혜숙')) {
                        hasJeong = true;
                        break;
                    }
                }
            }
            if (hasJeong || (data.session == '929' || data.session == '928' || data.session == 929 || data.session == 928)) {
                records.push({ id: doc.id, ...data });
            }
        });

        records.sort((a, b) => b.session - a.session);
        
        let dupCheck = {};

        records.forEach(r => {
            console.log(`\n======================================`);
            console.log(`[문서ID] ${r.id}`);
            console.log(`[조직] ${r.churchName} > ${r.curiaName} > ${r.presidiumName}`);
            console.log(`[회차/날짜] ${r.session}회 (${r.date}) 요일: ${r.day}`);
            console.log(`[생성일/수정일] Created: ${r.createdAt? r.createdAt.toDate?.() : 'N/A'}, Updated: ${r.updatedAt? r.updatedAt.toDate?.() : 'N/A'}`);
            
            // 정혜숙 데이터 찾기
            for (let uid in r.attendanceData) {
                const att = r.attendanceData[uid];
                if (att.name && att.name.includes('정혜숙')) {
                    console.log(`  -> 👤 ${att.name} (${att.role}): 출결상태 = ${att.status === 'P' ? '출석(Present)' : '결석(Absent)'}`);
                }
            }

            let key = `${r.presidiumName}_${r.session}_${r.date}`;
            if (dupCheck[key]) {
                console.log(`🚨 [경고] 위 데이터는 중복입니다! (이미 같은 쁘레시디움/회차/날짜 데이터가 존재함)`);
            } else {
                dupCheck[key] = true;
            }
        });
        
        console.log(`\n✅ 총 ${records.length}건을 확인했습니다.`);
        process.exit(0);
    } catch (e) {
        console.error("에러 발생:", e);
        process.exit(1);
    }
}

checkAttendance();
