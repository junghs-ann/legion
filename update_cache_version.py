import os
import traceback

def update_script_tags():
    try:
        version = "2026.03.03.1111"
        count = 0
        for filename in os.listdir('.'):
            if filename.endswith('.html'):
                try:
                    with open(filename, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    # Replace script.js with versioned one
                    new_content = content.replace('src="script.js"', f'src="script.js?v={version}"')
                    new_content = new_content.replace('href="styles.css?v=12"', f'href="styles.css?v={version}"')
                    new_content = new_content.replace('href="styles.css"', f'href="styles.css?v={version}"')
                    
                    if content != new_content:
                        with open(filename, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                        print(f"Updated {filename}")
                        count += 1
                except Exception as e:
                    print(f"Error processing {filename}: {e}")
        print(f"Total files updated: {count}")
    except Exception:
        print(traceback.format_exc())

if __name__ == "__main__":
    update_script_tags()
