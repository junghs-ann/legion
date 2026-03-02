import os

filepath = r'd:\jhs\legion\attendance_history.html'

with open(filepath, 'rb') as f:
    raw = f.read()

# Remove BOM if present
if raw.startswith(b'\xef\xbb\xbf'):
    raw = raw[3:]

# The corruption happened because CP949 bytes were treated as UTF-8 and saved.
# Or something similar. Let's try to decode as latin-1 to get raw bytes as string, 
# then encode back to bytes and decode as cp949.

try:
    # Try the most likely scenario: CP949 bytes are in there
    content = raw.decode('cp949')
    print("Decoded directly as cp949")
except:
    try:
        # Scenario 2: It was UTF-8 but with CP949 bytes inside
        content = raw.decode('utf-8').encode('latin-1').decode('cp949')
        print("Decoded with latin-1 hop")
    except:
        content = None

if content:
    # Fix menu
    import re
    officer_menu_regex = re.compile(r'^(\s*)<li><a href="officer_status\.html">간부현황</a></li>', re.MULTILINE)
    if 'prae_adj_status.html' not in content:
        content = officer_menu_regex.sub(rf'\g<0>\n\1<li><a href="prae_adj_status.html">쁘레/아듀또리움 현황</a></li>', content)
    
    with open(filepath, 'w', encoding='utf-8', newline='\n') as f:
        f.write(content)
    print("Successfully fixed attendance_history.html")
else:
    print("Failed to fix attendance_history.html")
