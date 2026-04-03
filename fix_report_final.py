import os
import re

file_path = 'd:/jhs/legion/monthly_report_view_v2.html'

# 1. 파일 읽기 (UTF-8)
with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

# 2. 깨진 한글(모지바케) 복구 매핑
replacements = {
    '?섎젅?쒕뵒?€': '레지오 마리에',
    '?붾? 蹂닿퀬??': '월례 보고서',
    '?앹꽦 以!..': '생성 중..',
    '?뺤씤': '확인',
    '痍⑥냼': '취소',
    '?대떦 ?ъ젣': '담당 사제',
    '?€由ъ옄': '대리자',
    '理쒖쥌 ?뱀씤': '최종 승인',
    '?뱀씤 痍⑥냼': '승인 취소',
    '?곹깭 ?€??': '상태 저장',
    '蹂닿퀬?쒓?': '보고서가',
    '?뱀씤?섏뿀?듬땲??': '승인되었습니다',
    '諛쒖깮?덉뒿?덈떎': '발생했습니다',
    '怨좎쑀踰덊샇': '고유번호',
    '吏?梨?': '직책',
    '??紐?': '성명',
    '??濡€ 紐?': '세례명',
    '異???': '축일',
    '??紐???': '임명일',
    '鍮?怨?': '비고',
    '紐⑤컮??': '모바일',
    '?붾㈃': '화면',
    '?뺣젹': '정렬',
    '??': '차',
    '李?': '차',
    '?몄뇙': '인쇄',
    '?뚯씪 留뚮뱾湲?': '파일 만들기',
    '罹≪쿂': '캡처',
    '?뺥빀??': '정합성'
}

for old, new in replacements.items():
    content = content.replace(old, new)

# 3. btnDownloadPDF 이벤트 리스너 구문 오류 수정
# 잘못 삽입된 CSS와 깨진 구문을 정상적인 onclone 콜백으로 교체합니다.

new_listener = r"""        document.getElementById('btnDownloadPDF').addEventListener('click', function() {
            const original = document.getElementById('reportDisplay');
            const originalPages = original.querySelectorAll('.report-page');

            // 데이터 정보 추출
            const serial = (document.getElementById('serialNum').textContent || "").trim();
            const church = (document.getElementById('footChurch') ? document.getElementById('footChurch').textContent : "").trim();
            const presidium = (document.getElementById('footPr') ? document.getElementById('footPr').textContent : "").trim();
            const month = (document.getElementById('repMonth').textContent || "00").trim().padStart(2, '0');
            const year = (document.getElementById('repYear').textContent || "").trim();
            const fileName = `${serial}.${church}.${presidium}Pr._${month}월 월례보고서_${year}년.pdf`;

            const btn = this;
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 생성 중..';
            btn.disabled = true;

            // [최종 최적화] 스크롤 위치 초기화 및 마진 제거
            window.scrollTo(0, 0);
            originalPages.forEach(p => {
                p.style.margin = '0';
                p.style.boxShadow = 'none';
            });

            const opt = {
                margin:       0,
                filename:     fileName,
                image:        { type: 'jpeg', quality: 1.0 },
                html2canvas:  {
                    scale: 2,
                    useCORS: true,
                    scrollY: 0,
                    scrollX: 0,
                    onclone: (clonedDoc) => {
                        const styleNode = clonedDoc.createElement('style');
                        styleNode.innerHTML = `
                            /* [PDF 전용] 표 테두리 더 선명하게 조정 */
                            table, th, td {
                                border: 0.1pt solid #444 !important;
                                border-collapse: collapse !important;
                            }

                            /* 2페이지 활동 상세: 정렬 및 여백 보정 */
                            #activityDetailBody th, #activityDetailBody td { 
                                padding: 1.5mm 1mm 1.5mm 2.5mm !important; 
                                line-height: 1.25 !important; 
                                font-size: 10pt !important; 
                            }
                            #activityDetailBody td:nth-child(2) { text-align: center !important; padding-left: 0 !important; }
                            #activityDetailBody td:nth-child(3) { text-align: left !important; padding-left: 10px !important; }

                            .serial-box { border: 0.1pt solid #444 !important; }
                            .serial-label { border: none !important; border-bottom: 0.1pt solid #444 !important; }
                            .underline { border: none !important; border-bottom: 0.1pt solid #444 !important; display: inline-block !important; } 

                            /* [PDF 전용] 주요 활동 요약 내 활동 내용 정렬 */
                            #activitySummaryBody td {
                                vertical-align: middle !important;
                            }
                            #activitySummaryBody td > div {
                                padding-left: 5px !important;
                                text-align: left !important;
                                display: block !important;
                            }
                            
                            /* [PDF 전용] 동그라미 숫자 항목 정렬 보정 */
                            .circled-item, 
                            #activitySummaryBody td div[style*="text-indent: -1.2em"],
                            #activitySummaryBody td[style*="text-indent: -1.2em"] {
                                padding-left: 2.0em !important;
                                text-indent: -1.2em !important;
                                text-align: left !important;
                                display: block !important;
                            }

                            #activitySummaryBody td:nth-child(1),
                            #activitySummaryBody td:nth-child(5) {
                                text-align: center !important;
                                padding-left: 0 !important;
                            }

                            .report-table td[width="35"],
                            .report-table td:first-child {
                                text-align: center !important;
                                padding: 0.5mm 1mm !important;
                            }
                        `;
                        clonedDoc.head.appendChild(styleNode);
                    }
                },
                jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
                pagebreak:    { mode: 'css' }
            };

            html2pdf().set(opt).from(original).save().then(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
                originalPages.forEach(p => {
                    p.style.margin = '';
                    p.style.boxShadow = '';
                });
            }).catch(err => {
                console.error('PDF 생성 에러:', err);
                alert('PDF 생성 중 오류가 발생했습니다.');
                btn.innerHTML = originalText;
                btn.disabled = false;
                originalPages.forEach(p => {
                    p.style.margin = '';
                    p.style.boxShadow = '';
                });
            });
        });"""

# 정규표현식으로 btnDownloadPDF 이벤트 리스너 블록을 찾아서 교체합니다.
# 캡처 범위: document.getElementById('btnDownloadPDF').addEventListener('click', function() { ... });
pattern = re.compile(r"document\.getElementById\('btnDownloadPDF'\)\.addEventListener\('click', function\(\) \{.*?\}\);", re.DOTALL)
if pattern.search(content):
    content = pattern.sub(new_listener, content)
    print("[*] btnDownloadPDF listener fixed.")
else:
    # 만약 정규표현식으로 못 찾을 경우, 좀 더 느슨한 방식으로 시도 (손상이 심할 경우 대비)
    print("[!] Regex match failed. Attempting fallback fix.")
    start_tag = "document.getElementById('btnDownloadPDF').addEventListener('click'"
    end_tag = "});"
    # 수동 검색 (가장 가까운 }); 를 찾음)
    start_idx = content.find(start_tag)
    if start_idx != -1:
        # </script> 이전의 마지막 }); 를 찾는 것이 안전할 수 있음
        script_end_idx = content.find("</script>", start_idx)
        # 해당 스크립트 블록 내에서 btnDownloadPDF 핸들러의 종료 지점을 찾기 위해 조금 복잡하지만 교체
        # 여기서는 단순히 listener 전체가 포함된 구문을 교체하는 전략
        # (이미 깨진 상태이므로 특정 지점부터 특정 지점까지 통째로 날림)
        content = content[:start_idx] + new_listener + content[content.find("});", start_idx) + 3:]
        print("[*] Fallback fix applied.")

# 4. 파일 쓰기
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("[*] 월례보고서 뷰어 복구 완료.")
