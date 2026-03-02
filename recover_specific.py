import os

filepath = r'd:\jhs\legion\attendance_history.html'

# Read as bytes
with open(filepath, 'rb') as f:
    raw = f.read()

# Try reading as CP949 (Korean ANSI)
try:
    content = raw.decode('cp949')
    if 'html' in content.lower():
        print("Successfully recovered with cp949")
        # Fix menu as well
        import re
        officer_menu_regex = re.compile(r'^(\s*)<li><a href="officer_status\.html">간부현황</a></li>', re.MULTILINE)
        if 'prae_adj_status.html' not in content:
            content = officer_menu_regex.sub(rf'\g<0>\n\1<li><a href="prae_adj_status.html">쁘레/아듀또리움 현황</a></li>', content)
        
        with open(filepath, 'w', encoding='utf-8', newline='\n') as f:
            f.write(content)
        print("Saved recovered file as utf-8")
except Exception as e:
    print(f"Failed recovery: {e}")
