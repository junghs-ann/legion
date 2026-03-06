import os
import re

version = "20260303_1255_fix"
count = 0

for filename in os.listdir('.'):
    if filename.endswith('.html'):
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace styles.css?v=... with the new version
        new_content = re.sub(r'styles\.css(\?v=[a-zA-Z0-9_.]+)?', f'styles.css?v={version}', content)
        # Update script line
        new_content = re.sub(r'script\.js(\?v=[a-zA-Z0-9_.]+)?', f'script.js?v={version}', new_content)
        
        if content != new_content:
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(new_content)
            count += 1
            print(f"Updated {filename}")
            
print(f"Total files updated: {count}")
