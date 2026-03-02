import os
import re

directory = r'd:\jhs\legion'
target_pattern = re.compile(r'^(\s*)<li><a href="officer_status\.html">간부현황</a></li>', re.MULTILINE)

for filename in os.listdir(directory):
    if filename.endswith('.html'):
        filepath = os.path.join(directory, filename)
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            if 'officer_status.html' in content and 'prae_adj_status.html' not in content:
                new_content = target_pattern.sub(rf'\g<0>\n\1<li><a href="prae_adj_status.html">쁘레/아듀또리움 현황</a></li>', content)
                with open(filepath, 'w', encoding='utf-8', newline='\n') as f:
                    f.write(new_content)
                print(f"Updated: {filename}")
            else:
                print(f"Skipped/Done: {filename}")
        except Exception as e:
            print(f"Error processing {filename}: {e}")
