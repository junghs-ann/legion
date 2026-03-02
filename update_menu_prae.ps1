$files = Get-ChildItem "d:\jhs\legion\*.html"
$newMenuItem = '                    <li><a href="officer_status.html">간부현황</a></li>`r`n                    <li><a href="prae_adj_status.html">쁘레/아듀또리움 현황</a></li>'

foreach ($file in $files) {
    try {
        $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
        
        # "간부현황" 메뉴 찾기 (중복 추가 방지 포함)
        if ($content -match 'officer_status.html' -and -not ($content -match 'prae_adj_status.html')) {
            $newContent = $content -replace '<li><a href="officer_status.html">간부현황</a></li>', $newMenuItem
            [System.IO.File]::WriteAllText($file.FullName, $newContent, [System.Text.Encoding]::UTF8)
            Write-Host "Updated: $($file.Name)"
        }
    } catch {
        Write-Host "Error in $($file.Name): $($_.Exception.Message)"
    }
}
