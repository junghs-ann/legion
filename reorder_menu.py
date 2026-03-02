import os
import re
import sys

# Ensure UTF-8 for output
try:
    sys.stdout.reconfigure(encoding='utf-8')
except AttributeError:
    pass

directory = r"d:\jhs\legion"
if not os.path.exists(directory):
    print(f"Directory not found: {directory}")
    sys.exit(1)

files = [f for f in os.listdir(directory) if f.endswith(".html")]
print(f"Found {len(files)} html files.")

# Re-ordering Regex:
regex_str = r'(?s)(<li class="nav-item">.*?소통.*?</li>\s*<li class="nav-item".*?>.*?보고서.*?</li>\s*)(<li class="nav-item">.*?각종 장부.*?</li>)'
regex = re.compile(regex_str)

success_count = 0
skip_count = 0

for filename in files:
    path = os.path.join(directory, filename)
    try:
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()
        
        match = regex.search(content)
        if match:
            # Reorder: 각종 장부 ($2) then 소통+보고서 ($1)
            # Use \g<n> for safety in replacement string
            new_content = regex.sub(r'\g<2>\n            \g<1>', content)
            
            with open(path, "w", encoding="utf-8") as f:
                f.write(new_content)
            print(f"Updated: {filename}")
            success_count += 1
        else:
            print(f"Skipped: {filename}")
            skip_count += 1
    except Exception as e:
        print(f"Error in {filename}: {e}")

print(f"\nSummary: Success={success_count}, Skipped={skip_count}")
