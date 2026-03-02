import os
import re

directory = r'd:\jhs\legion'
officer_menu_regex = re.compile(r'^(\s*)<li><a href="officer_status\.html">간부현황</a></li>', re.MULTILINE)

def fix_and_update(filepath):
    # Try different encodings to read the files
    encodings = ['utf-8', 'utf-16', 'cp949', 'euc-kr']
    content = None
    
    # Read binary first to detect BOM or for safe check
    with open(filepath, 'rb') as f:
        raw = f.read()

    for enc in encodings:
        try:
            content = raw.decode(enc)
            # If it decoded, check if it has common Korean words or just tags
            if 'html' in content.lower():
                print(f"Read {os.path.basename(filepath)} with {enc}")
                break
        except:
            continue
    
    if content is None:
        print(f"Could not decode {filepath}")
        return

    # Update menu if not already present
    if 'officer_status.html' in content and 'prae_adj_status.html' not in content:
        content = officer_menu_regex.sub(rf'\g<0>\n\1<li><a href="prae_adj_status.html">쁘레/아듀또리움 현황</a></li>', content)
        print(f"Added menu to {os.path.basename(filepath)}")
    
    # Save as UTF-8 (no BOM)
    with open(filepath, 'w', encoding='utf-8', newline='\n') as f:
        f.write(content)

for filename in os.listdir(directory):
    if filename.endswith('.html'):
        fix_and_update(os.path.join(directory, filename))
