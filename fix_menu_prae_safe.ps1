$files = Get-ChildItem "d:\jhs\legion\*.html"
foreach ($file in $files) {
    try {
        $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
        if ($content -match 'officer_status\.html' -and -not ($content -match 'prae_adj_status\.html')) {
            $lines = $content -split "\r?\n"
            $newLines = @()
            $found = $false
            foreach ($line in $lines) {
                $newLines += $line
                if ($line -match '<li><a href="officer_status\.html">간부현황</a></li>') {
                    # <li> 태그 앞의 모든 공백을 추출
                    $indentMatch = [regex]::Match($line, '^(\s*)<li>')
                    if ($indentMatch.Success) {
                        $indent = $indentMatch.Groups[1].Value
                        $newLines += "$($indent)<li><a href=`"prae_adj_status.html`">쁘레/아듀또리움 현황</a></li>"
                        $found = $true
                    }
                }
            }
            if ($found) {
                $newContent = [string]::Join("`r`n", $newLines)
                [System.IO.File]::WriteAllText($file.FullName, $newContent, [System.Text.Encoding]::UTF8)
                Write-Host "Updated: $($file.Name)"
            }
        }
    } catch {
        Write-Host "Error in $($file.Name): $($_.Exception.Message)"
    }
}
