const fs = require('fs');

try {
    let f = fs.readFileSync('monthly_report_view_v2.html', 'utf8');
    
    // Normalize line endings to make regex predictable
    f = f.replace(/\r\n/g, '\n');

    // 1. The bad HTML has 'othVal.toLocaleString() 회</td>' 
    //    then '</tr>'
    //    then '<tr style="height: 7.0mm;">'
    //    then it might have const sumAct = ...
    //    then '<td style="border:1px solid #111; text-align:center;">5</td>'
    //    then '<td colspan="2" style="border:1px solid #111; padding-left:5px; font-size:8.7pt;">탄소중립 실천하기</td>'

    const searchPattern = /<td style="border:1px solid #111; text-align:right; padding-right:5px; border-top:1px solid #ddd; font-weight:bold;">\$\{othVal\.toLocaleString\(\)\} 회<\/td>\n                                    <\/tr>\n                                    <tr style="height: 7\.0mm;">\n(?:[ \t]*const sumAct = \(name\) => \{\n(?:.|\n)*?\}, 0\);\n[ \t]*\};\n)?                                        <td style="border:1px solid #111; text-align:center;">5<\/td>\n                                        <td colspan="2" style="border:1px solid #111; padding-left:5px; font-size:8\.7pt;">탄소중립 실천하기<\/td>/g;

    const goodReplacement = `<td style="border:1px solid #111; text-align:right; padding-right:5px; border-top:1px solid #ddd; font-weight:bold;">\${othVal.toLocaleString()} 회</td>
                                    </tr>
                                    <tr style="height: 7.0mm;">
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
                                        <td style="border:1px solid #111; text-align:center;">5</td>
                                        <td colspan="2" style="border:1px solid #111; padding-left:5px; font-size:8.7pt;">탄소중립 실천하기</td>`;

    if (searchPattern.test(f)) {
        f = f.replace(searchPattern, goodReplacement);
        console.log('SUCCESS: HTML damage fully repaired.');
    } else {
        console.log('ERROR: HTML damage pattern not found.');
    }

    fs.writeFileSync('monthly_report_view_v2.html', f);
} catch(e) { console.error(e); }
