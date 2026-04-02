import os
import re
import datetime

def update_cache_version():
    """ 모든 HTML 파일 내의 .js 및 .css 파일 경로 뒤에 현재 시간 기반의 버전(?v=YYYYMMDD_HHMM)을 주입합니다. """
    
    # 1. 현재 시간을 기반으로 배포 버전 문자열 생성 (예: 20240401_0135)
    current_version = datetime.datetime.now().strftime("%Y%m%d_%H%M")
    print(f"[*] 새로운 배포 버전 생성: {current_version}")
    
    # 2. 정규표현식 패턴 정의
    # href="styles.css?v=..." 또는 src="script.js" 등을 모두 찾습니다.
    patterns = [
        (r'(src="script\.js)(\?v=[^"]*)?(")', f'src="script.js?v={current_version}"'),
        (r'(href="styles\.css)(\?v=[^"]*)?(")', f'href="styles.css?v={current_version}"')
    ]
    
    count = 0
    # 3. 현재 디렉토리의 모든 HTML 파일 탐색
    for filename in os.listdir('.'):
        if filename.endswith('.html'):
            try:
                with open(filename, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                new_content = content
                for pattern, replacement in patterns:
                    new_content = re.sub(pattern, replacement, new_content)
                
                if content != new_content:
                    with open(filename, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"    [+] {filename} 업데이트 완료")
                    count += 1
            except Exception as e:
                print(f"    [!] {filename} 처리 중 오류 발생: {e}")
                
    print(f"[*] 총 {count}개의 파일이 성공적으로 업데이트되었습니다.")

if __name__ == "__main__":
    update_cache_version()
