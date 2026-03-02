$files = Get-ChildItem "d:\jhs\legion\*.html"
# 간부현황 메뉴 뒤에 정확한 들여쓰기를 유지하며 메뉴 추가
$pattern = '(?m)^(\s*)<li><a href="officer_status.html">간부현황</a></li>'

foreach ($file in $files) {
    try {
        $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
        
        if ($content -match 'officer_status.html' -and -not ($content -match 'prae_adj_status.html')) {
            # 매치된 줄의 들여쓰기를 그대로 사용하여 다음 줄 추가
            $newContent = $content -replace $pattern, ('$0`r`n$1<li><a href="prae_adj_status.html">쁘레/아듀또리움 현황</a></li>')
            [System.IO.File]::WriteAllText($file.FullName, $newContent, [System.Text.Encoding]::UTF8)
            Write-Host "Fixed: $($file.Name)"
        }
    } catch {
        Write-Host "Error in $($file.Name): $($_.Exception.Message)"
    }
}
