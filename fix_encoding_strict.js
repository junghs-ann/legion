const fs = require('fs');

try {
    let f = fs.readFileSync('monthly_report_view_v2.html', 'utf8');

    // FIX 1: getSum block
    const getSumStart = f.indexOf('const spec1Val = getSum');
    const getSumEnd = f.indexOf('const summaryTableBody =') - 16;
    
    if (getSumStart > -1 && getSumEnd > getSumStart) {
        const cleanGetSumBlock = `const spec1Val = getSum('대전교구 레지오마리애 도입 70주년 묵주기도');
                const spec2Val = getSum('서울세계청년대회 묵주기도 10억 단 바치기');
                const spec3Val = getSum('관평동성당 첫 사제를 위한 영적 예물 바치기');
                const rOldVal = getSum('묵주기도');
                const massVal = getSum('평일미사참례');
                const bibleVal = getSum('성경읽기') + getSum('성경쓰기');
                const mediVal = getSum('매일미사읽고묵상');
                const legionVal = getSum('주간 성모님의 군단 읽기') || getSum('월간 성모님의 군단 읽기');

                const newVal = getSum('새 가족 찾기');
                const soulVal = getSum('쉬는 교우 돌봄') || getSum('냉담 교우 회두');
                const welVal = getSum('복지시설 봉사') || getSum('복지시설');
                const hospVal = getSum('병원.요양원 방문') || getSum('병원.요양원');
                const othVal = getSum('기타 사랑봉사');
                const peaceVal = getSum('반사 평화 기도') || getSum('밤9시 주모경 바치기') || getSum('한반도 평화를 위한 밤 9시 주모경 바치기');
                const groupVal = getSum('행동단원, 협조단원 모집 및 돌봄 활동') || getSum('특별 돌봄 활동') || getSum('쉬는 교우(5년이내) 돌봄') || 0;
                const ecoVal = getSum('탄소중립 실천하기');
                const holyVal = getSum('거룩한 독서');
                const noteVal = getSum('거룩한 독서 노트 작성') || 0;
`;
        f = f.slice(0, getSumStart) + cleanGetSumBlock + f.slice(getSumEnd);
        console.log('Fixed getSum block');
    } else {
        console.log('Failed to find getSum block bounds');
    }

    // FIX 2: setVal block
    const setValStart = f.indexOf("setVal('sum_rosary', sumAct");
    const setValEnd = f.indexOf('// 8. 활동 상세') - 16;

    if (setValStart > -1 && setValEnd > setValStart) {
        const cleanSetValBlock = `setVal('sum_rosary', sumAct('묵주기도').toLocaleString());
                setVal('sum_mass', sumAct('평일미사참례').toLocaleString());
                setVal('sum_bible', (sumAct('성경읽기') + sumAct('성경쓰기')).toLocaleString()); // 성경읽기 + 성경쓰기 합산
                setVal('sum_medi', sumAct('매일미사읽고묵상').toLocaleString());
                setVal('sum_legion', sumAct('월간 성모님의 군단 읽기').toLocaleString());

                setVal('sum_new', sumAct('새 가족 찾기').toLocaleString());
                setVal('sum_soul', sumAct('냉담 교우 회두').toLocaleString());
                // 사랑의 증언활동 합계 집계 (복지시설, 병원.요양원, 기타 사랑봉사)
                const totalMercy = sumAct('복지시설') + sumAct('병원.요양원') + sumAct('기타 사랑봉사');
                setVal('sum_mercy_total', totalMercy.toLocaleString());
                // 개별 값은 별도 필요 시 사용
                setVal('sum_wel', sumAct('복지시설').toLocaleString());
                setVal('sum_hosp', sumAct('병원.요양원').toLocaleString());
                setVal('sum_oth', sumAct('기타 사랑봉사').toLocaleString());

                setVal('sum_peace', sumAct('밤9시 주모경 바치기').toLocaleString()); // 복구됨
                setVal('sum_care', sumAct('쉬는 교우(5년이내) 돌봄').toLocaleString());
                setVal('sum_eco', sumAct('탄소중립 실천하기').toLocaleString()); // 항목 추가
                setVal('sum_holy', sumAct('거룩한 독서').toLocaleString());     // 복구
                setVal('sum_note', '0'); // 노트작성 (임시 0)
`;
        f = f.slice(0, setValStart) + cleanSetValBlock + f.slice(setValEnd);
        console.log('Fixed setVal block');
    } else {
        console.log('Failed to find setVal block bounds');
    }

    fs.writeFileSync('monthly_report_view_v2.html', f);
    console.log('Successfully saved monthly_report_view_v2.html');
} catch (e) {
    console.error('Error:', e);
}
