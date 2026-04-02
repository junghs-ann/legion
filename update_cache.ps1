# 모든 HTML 파일 내의 .js 및 .css 파일 버전(?v=YYYYMMDD_HHMM)을 갱신합니다.

# 1. 현재 시간을 기반으로 버전 문자열 생성
$currentVersion = Get-Date -Format "yyyyMMdd_HHmm"
Write-Host "[*] 새로운 배포 버전 생성: $currentVersion" -ForegroundColor Cyan

# 2. 현재 디렉토리의 모든 HTML 파일 탐색
$htmlFiles = Get-ChildItem -Filter *.html

$count = 0
foreach ($file in $htmlFiles) {
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    
    # 정규표현식으로 script.js 및 styles.css 뒤의 쿼리 스트링 교체
    # src="script.js" -> src="script.js?v=..."
    # src="script.js?v=123" -> src="script.js?v=..."
    $newContent = $content -replace '(src="script\.js)(\?v=[^"]*)?(")', "`$1?v=$currentVersion`$3"
    $newContent = $newContent -replace '(href="styles\.css)(\?v=[^"]*)?(")', "`$1?v=$currentVersion`$3"
    
    if ($content -ne $newContent) {
        $newContent | Set-Content -Path $file.FullName -Encoding UTF8
        Write-Host "    [+] $($file.Name) 업데이트 완료" -ForegroundColor Green
        $count++
    }
}

Write-Host "[*] 총 $count 개의 파일이 성공적으로 업데이트되었습니다." -ForegroundColor Cyan
