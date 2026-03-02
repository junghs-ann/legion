import os
import re

directory = r'd:\jhs\legion'
target_file_pattern = re.compile(r'.*\.html$')
# 정규표현식: "간부현황" 메뉴를 포함하는 줄을 찾고, 그 앞의 들여쓰기를 캡처
officer_menu_regex = re.compile(r'^(\s*)<li><a href="officer_status\.html">간부현황</a></li>', re.MULTILINE)
new_menu_item = r'\1<li><a href="prae_adj_status.html">쁘레/아듀또리움 현황</a></li>'

for filename in os.listdir(directory):
    if target_file_pattern.match(filename):
        filepath = os.path.join(directory, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 중복 방지 및 "간부현황" 존재 여부 확인
        if 'officer_status.html' in content and 'prae_adj_status.html' not in content:
            # 기존 줄($0)을 그대로 두고 그 다음 줄에 동일한 들여쓰기(\1)로 새 메뉴 추가
            updated_content = officer_menu_regex.sub(rf'\g<0>\n\1<li><a href="prae_adj_status.html">쁘레/아듀또리움 현황</a></li>', content)
            
            with open(filepath, 'w', encoding='utf-8', newline='') as f:
                f.write(updated_content)
            print(f"Updated: {filename}")
        else:
            if 'prae_adj_status.html' in content:
                print(f"Skipped (already exists): {filename}")
            else:
                print(f"Skipped (officer_status not found): {filename}")
