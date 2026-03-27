const fs = require('fs');

try {
    let f = fs.readFileSync('monthly_report_view_v2.html', 'utf8');

    // 1. REPAIR the HTML that was accidentally deleted
    const badHTMLBlock = `                                    <tr style="height: 7.0mm;">
                const sumAct = (name) => {
                    return recs.reduce((a, r) => {
                        const c = r.counts || r.activityCounts || {};
                        let val = (parseInt(c[name]) || 0);
                        return a + val;
                    }, 0);
                };
                                        <td style="border:1px solid #111; text-align:center;">5</td>`;

    const goodHTMLBlock = `                                    <tr style="height: 7.0mm;">
                                        <td rowspan="5" style="border:1px solid #111; padding-left:5px; font-size:8.7pt; vertical-align:middle;">④ 성모님의 군단읽기</td>
                                        <td rowspan="5" style="border:1px solid #111; text-align:right; padding-right:10px; font-weight:bold;">\${legionVal.toLocaleString()} 쪽</td>
                                        <td style="border:1px solid #111; text-align:center;">3</td>
                                        <td colspan="2" style="border:1px solid #111; padding-left:5px; font-size:8.2pt;">밤 9시 주모경 바치기</td>
                                        <td style="border:1px solid #111; text-align:right; padding-right:5px; font-weight:bold;">\${peaceVal.toLocaleString()} 회</td>
                                    </tr>
                                    <tr style="height: 7.0mm;">
                                        <td style="border:1px solid #111; text-align:center;">4</td>
                                        <td colspan="2" style="border:1px solid #111; padding-left:5px; font-size:8.2pt;">세례성사후 5년이내 쉬는 교우들 특별히 돌보기</td>
                                        <td style="border:1px solid #111; text-align:right; padding-right:5px; font-weight:bold;">\${groupVal.toLocaleString()} 회</td>
                                    </tr>
                                    <tr style="height: 7.0mm;">
                                        <td style="border:1px solid #111; text-align:center;">5</td>`;

    if (f.includes(badHTMLBlock)) {
        f = f.replace(badHTMLBlock, goodHTMLBlock);
        console.log('Successfully repaired the HTML template literal.');
    } else {
        console.log('Warning: Could not find the bad HTML block to repair.');
    }

    // 2. FIX the REAL sumAct bug
    const badSumAct = `                const sumAct = (name) => {
                    return recs.reduce((a, c) => {
                        let val = (parseInt(c.counts && c.counts[name]) || 0);
                        return a + val;
                    }, 0);
                };`;

    const goodSumAct = `                const sumAct = (name) => {
                    return recs.reduce((a, r) => {
                        let c = r.counts || r.activityCounts || {};
                        let val = parseInt(c[name]) || 0;
                        return a + val;
                    }, 0);
                };`;

    if (f.includes(badSumAct)) {
        f = f.replace(badSumAct, goodSumAct);
        console.log('Successfully applied the REAL sumAct fix for activityCounts.');
    } else {
        console.log('Warning: Could not find the bad sumAct function.');
    }

    fs.writeFileSync('monthly_report_view_v2.html', f);
    console.log('All patches applied.');
} catch (e) {
    console.error(e);
}
