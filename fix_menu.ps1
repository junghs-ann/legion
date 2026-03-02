$files = Get-ChildItem "d:\jhs\legion\*.html"
foreach ($file in $files) {
    try {
        $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
        
        # Pattern: 소통 -> 보고서 -> 각종 장부
        # We want: 각종 장부 -> 소통 -> 보고서
        
        $regex = '(?s)(<li class="nav-item">.*?소통.*?</li>\s*<li class="nav-item".*?>\s*보고서.*?</li>\s*)(<li class="nav-item">.*?각종 장부.*?</li>)'
        
        if ($content -match $regex) {
            # $matches[2] is 각종 장부
            # $matches[1] is 소통 + 보고서
            $newContent = $content -replace $regex, '$2`r`n            $1'
            [System.IO.File]::WriteAllText($file.FullName, $newContent, [System.Text.Encoding]::UTF8)
            Write-Host "Updated: $($file.Name)"
        }
    } catch {
        Write-Host "Error in $($file.Name): $($_.Exception.Message)"
    }
}
