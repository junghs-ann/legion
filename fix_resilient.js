const fs = require('fs');

try {
    let f = fs.readFileSync('monthly_report_view_v2.html', 'utf8');

    const badHTMLRegex = /<tr style="height: 7\.0mm;">[\s\r\n]*const sumAct\s*=\s*\(name\)\s*=>\s*\{[\s\S]*?return a \+ val;[\s\r\n]*\},\s*0\);[\s\r\n]*\};[\s\r\n]*<td style="border:1px solid #111; text-align:center;">5<\/td>/;
    
    const goodHTMLBlock = `<tr style="height: 7.0mm;">
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

    if (badHTMLRegex.test(f)) {
        f = f.replace(badHTMLRegex, goodHTMLBlock);
        console.log('Fixed HTML template corruption.');
    } else {
        console.log('Warn: badHTMLRegex did not match.');
    }

    const badSumActRegex = /const sumAct\s*=\s*\(name\)\s*=>\s*\{[\s\r\n]*return recs\.reduce\(\(a,\s*c\)\s*=>\s*\{[\s\r\n]*let val\s*=\s*\(parseInt\(c\.counts\s*&&\s*c\.counts\[name\]\)\s*\|\|\s*0\);[\s\r\n]*return a\s*\+\s*val;[\s\r\n]*\},\s*0\);[\s\r\n]*\};/;

    const goodSumAct = `const sumAct = (name) => {
                    return recs.reduce((a, r) => {
                        let c = r.counts || r.activityCounts || {};
                        let val = parseInt(c[name]) || 0;
                        return a + val;
                    }, 0);
                };`;

    if (badSumActRegex.test(f)) {
        f = f.replace(badSumActRegex, goodSumAct);
        console.log('Fixed real sumAct execution.');
    } else {
        console.log('Warn: badSumActRegex did not match.');
    }

    fs.writeFileSync('monthly_report_view_v2.html', f);
    console.log('Saved file.');
} catch(e) { console.error(e); }
