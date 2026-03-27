
import os

file_path = r'd:\jhs\legion\monthly_report_view.html'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Row 2 시작 지점 찾기
start_marker = "<!-- 행 2: [좌] 특별목표 계속 / [우] 1번 (계속) 쉬는교우회두 -->"
start_idx = content.find(start_marker)

# 이월금 계산 시작 지점 찾기 (손상된 블록 이후의 안전한 앵커)
end_marker = "let initBal = 0;"
end_idx = content.find(end_marker)

if start_idx != -1 and end_idx != -1:
    # 새로운 클린 코드 (Row 2 ~ Row 11 + 블록 닫기)
    new_rows = """<!-- 행 2: [좌] 특별목표 계속 / [우] 1번 (계속) 쉬는교우회두 -->
                            <tr style="height: 6.5mm;">
                                <td style="border-right: 1px solid #000; border-bottom: 1px solid #000; padding-left:5px; font-size:8.7pt; text-align:left;">쉬는교우회두</td>
                                <td style="border-right: 1px solid #000; border-bottom: 1px solid #000; padding-left:5px; font-size:8.7pt; text-align:left;">고해성사 및 신부님 면담</td>
                                <td style="text-align:right; border-bottom: 1px solid #000; padding-right:5px; font-weight:bold; font-size:10pt;"><span id="sum_soul">${soulVal ? soulVal.toLocaleString() : '0'}</span> 명</td>
                            </tr>
                            
                            <!-- 행 3: [좌] 일반 묵주기도 / [우] 2번 (3-5) 사랑의 증언 (대분류) -->
                            <tr style="height: 6.5mm;">
                                <td style="border-right: 1px solid #000; text-align:left; padding-left:5px; font-size:8.7pt; border-bottom:1px solid #000;">① 일반 묵주기도</td>
                                <td style="border-right: 1px solid #000; text-align:right; padding-right:10px; font-weight:bold; font-size:10.5pt; border-bottom:1px solid #000;"><span id="sum_rosary">${rOldVal.toLocaleString()}</span> 단</td>
                                
                                <td rowspan="3" style="border-right: 1px solid #000; text-align:center; font-weight:bold; border-bottom:1px solid #000;">2</td>
                                <td rowspan="3" style="border-right: 1px solid #000; text-align:center; font-size:9pt; font-weight:bold; line-height:1.2; border-bottom:1px solid #000;">사랑의<br>증언활동</td>
                                <td style="border-right: 1px solid #000; border-bottom:1px solid #ddd; padding-left:10px; font-size:8.7pt; text-align:left;">① 복지시설</td>
                                <td rowspan="3" style="text-align:right; padding-right:5px; font-weight:bold; vertical-align:middle; font-size:10pt; border-bottom:1px solid #000;"><span id="sum_mercy_total">${(welVal+hospVal+othVal).toLocaleString()}</span> 회</td>
                            </tr>
                            
                            <!-- 행 4: [좌] 2번 (4-11) ① 평일미사 (라인 1) / [우] 2번 (계속) 중분류 병원 -->
                            <tr style="height: 6mm;">
                                <td rowspan="8" style="border-right: 1px solid #000; text-align:center; font-weight:bold;">2</td>
                                <td rowspan="8" style="border-right: 1px solid #000; text-align:center; font-weight:bold; font-size:9pt; line-height:1.2; padding:0 1mm;">매일미사<br>와 말씀<br>과 함께<br>하기</td>
                                <td rowspan="2" style="border-right: 1px solid #000; border-bottom: 1px solid #ddd; padding-left:10px; font-size:8.7pt; text-align:left; vertical-align:middle;">① 평일미사 참례</td>
                                <td rowspan="2" style="border-right: 1px solid #000; border-bottom: 1px solid #ddd; text-align:right; padding-right:8px; font-weight:bold; font-size:10.5pt; vertical-align:middle;"><span id="sum_mass">${massVal.toLocaleString()}</span> 회</td>
                                <td style="border-right: 1px solid #000; border-bottom: 1px solid #ddd; padding-left:10px; font-size:8.7pt; text-align:left;">② 병원, 요양원</td>
                            </tr>
                            
                            <!-- 행 5: [좌] ① 평일미사 (라인 2) / [우] 2번 (계속) 소분류 기타 -->
                            <tr style="height: 6mm;">
                                <td style="border-right: 1px solid #000; border-bottom: 1px solid #000; padding-left:10px; font-size:8.2pt; text-align:left;">③ 기타(사랑봉사 및 소외 이웃 돌봄)</td>
                            </tr>
                            
                            <!-- 행 6: [좌] ② 성경읽기/쓰기 (라인 1) / [우] 3번 한반도 평화 -->
                            <tr style="height: 6.5mm;">
                                <td rowspan="2" style="border-top: 1px solid #000; border-right: 1px solid #000; border-bottom: 1px solid #ddd; padding-left:10px; font-size:8.7pt; text-align:left; vertical-align:middle;">② 성경읽기, 쓰기</td>
                                <td rowspan="2" style="border-top: 1px solid #000; border-right: 1px solid #000; border-bottom: 1px solid #ddd; text-align:right; padding-right:8px; font-weight:bold; font-size:10.5pt; vertical-align:middle;"><span id="sum_bible">${bibleVal.toLocaleString()}</span> 장</td>
                                <td style="border-right: 1px solid #000; text-align:center; border-bottom:1px solid #ddd; font-weight:bold;">3</td>
                                <td colspan="2" style="border-bottom: 1px solid #ddd; padding-left:8px; font-size:8.2pt; line-height:1.1; text-align:left;">한반도 평화를 위한 밤 9시 주모경 바치기</td>
                                <td style="text-align:right; border-bottom: 1px solid #ddd; padding-right:5px; font-weight:bold; font-size:10pt;"><span id="sum_peace">${peaceVal.toLocaleString()}</span> 회</td>
                            </tr>
                            
                            <!-- 행 7: [좌] ② 성경읽기/쓰기 (라인 2) / [우] 4번 행동단원 모집 -->
                            <tr style="height: 6.5mm;">
                                <td style="border-right: 1px solid #000; text-align:center; border-bottom:1px solid #ddd; font-weight:bold;">4</td>
                                <td colspan="2" style="border-bottom: 1px solid #ddd; padding-left:8px; font-size:8.4pt; text-align:left;">행동단원, 협조단원 모집 및 돌봄 활동</td>
                                <td style="text-align:right; border-bottom: 1px solid #ddd; padding-right:5px; font-weight:bold; font-size:10pt;"><span id="sum_care">${groupVal.toLocaleString()}</span> 회</td>
                            </tr>
                            
                            <!-- 행 8: [좌] ③ 매일미사 묵상 (라인 1) / [우] 5번 탄소중립 -->
                            <tr style="height: 6.5mm;">
                                <td rowspan="2" style="border-top: 1px solid #000; border-right: 1px solid #000; border-bottom: 1px solid #ddd; padding-left:10px; font-size:8.7pt; text-align:left; vertical-align:middle;">③ 매일미사 읽고, 묵상</td>
                                <td rowspan="2" style="border-top: 1px solid #000; border-right: 1px solid #000; border-bottom: 1px solid #ddd; text-align:right; padding-right:8px; font-weight:bold; font-size:10.5pt; vertical-align:middle;"><span id="sum_medi">${mediVal.toLocaleString()}</span> 회</td>
                                <td style="border-right: 1px solid #000; text-align:center; border-bottom:1px solid #ddd; font-weight:bold;">5</td>
                                <td colspan="2" style="border-bottom: 1px solid #ddd; padding-left:10px; font-size:8.7pt; text-align:left;">탄소중립 실천하기</td>
                                <td style="text-align:right; border-bottom: 1px solid #ddd; padding-right:5px; font-weight:bold; font-size:10pt;"><span id="sum_eco">${ecoVal.toLocaleString()}</span> 회</td>
                            </tr>
                            
                            <!-- 행 9: [좌] ③ 매일미사 묵상 (라인 2) / [우] 6번 (9-11) 거룩한 독서 시작 -->
                            <tr style="height: 6.5mm;">
                                <td rowspan="3" style="border-right: 1px solid #000; text-align:center; font-weight:bold;">6</td>
                                <td rowspan="3" style="border-right: 1px solid #000; text-align:center; font-size:9pt; font-weight:bold; line-height:1.2;">거룩한<br>독서</td>
                                <td rowspan="2" style="border-bottom:1px solid #ddd; padding-left:10px; font-size:8.5pt; text-align:left; vertical-align:middle;">말씀 봉독하기(시청,묵상,기도)</td>
                                <td rowspan="2" style="text-align:right; padding-right:5px; font-weight:bold; vertical-align:middle; font-size:10pt; border-bottom:1px solid #ddd;"><span id="sum_holy">${holyVal.toLocaleString()}</span> 회</td>
                            </tr>
                            
                            <!-- 행 10: [좌] ④ 성모님의 군단읽기 (라인 1) / [우] (계속) 말씀 봉독하기 -->
                            <tr style="height: 6.5mm;">
                                <td rowspan="2" style="border-top: 1px solid #000; border-right: 1px solid #000; padding-left:10px; font-size:8.7pt; text-align:left; vertical-align:middle;">④ 성모님의 군단읽기</td>
                                <td rowspan="2" style="border-top: 1px solid #000; border-right: 1px solid #000; text-align:right; padding-right:8px; font-weight:bold; font-size:10.5pt; vertical-align:middle;"><span id="sum_legion">${legionVal.toLocaleString()}</span> 쪽</td>
                            </tr>
                            
                            <!-- 행 11: [좌] ④ 성모님의 군단읽기 (라인 2) / [우] (계속) 노트작성 -->
                            <tr style="height: 6.5mm;">
                                <td style="padding-left:10px; font-size:8.5pt; text-align:left;">노트작성</td>
                                <td style="text-align:right; padding-right:5px; font-weight:bold; vertical-align:middle; font-size:10pt;"><span id="sum_note">0</span> 회</td>
                            </tr>
                        `;
                    }
                }
                """
    
    updated_content = content[:start_idx] + new_rows + content[end_idx:]
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(updated_content)
    print("Successfully restored and cleaned the file.")
else:
    print(f"Markers not found. start:{start_idx}, end:{end_idx}")
os.remove(__file__) # 스크립트 실행 후 자신을 삭제
