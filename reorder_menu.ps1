$files = Get-ChildItem "d:\jhs\legion\*.html"
$successCount = 0
$failCount = 0

foreach ($file in $files) {
    try {
        $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
        
        # Regex to capture "소통" and "보고서" blocks as $1, and "각종 장부" block as $2
        $regex = '(?s)(<li class="nav-item">\s*<span class="nav-link">소통</span>[\s\S]*?</li>\s*<li class="nav-item">\s*<span class="nav-link">보고서</span>[\s\S]*?</li>\s*)(<li class="nav-item text-nowrap">.*?</li>\s*|)(<li class="nav-item">\s*<span class="nav-link">각종 장부</span>[\s\S]*?</li>)'
        # Added a potential separator or extra menu item ($2) if it exists, though in most cases $2 will be empty.
        # Actually, let's keep it simple based on what I saw.
        
        $regex = '(?s)(<li class="nav-item">\s*<span class="nav-link">소통</span>[\s\S]*?</li>\s*<li class="nav-item  " id="menu-reports">\s*<span class="nav-link">보고서</span>[\s\S]*?</li>\s*|(<li class="nav-item">\s*<span class="nav-link">소통</span>[\s\S]*?</li>\s*<li class="nav-item  " id="menu-reports">\s*<span class="nav-link">보고서</span>[\s\S]*?</li>\s*)|(<li class="nav-item">\s*<span class="nav-link">소통</span>[\s\S]*?</li>\s*<li class="nav-item  "  id="menu-reports">\s*<span class="nav-link">보고서</span>[\s\S]*?</li>\s*)|(<li class="nav-item">\s*<span class="nav-link">소통</span>[\s\S]*?</li>\s*<li class="nav-item">\s*<span class="nav-link">보고서</span>[\s\S]*?</li>\s*))(<li class="nav-item">\s*<span class="nav-link">각종 장부</span>[\s\S]*?</li>)'
        
        # Refining to be more robust.
        $regex = '(?s)(<li class="nav-item">.*?소통.*?</li>\s*<li class="nav-item".*?>\s*보고서.*?</li>\s*)(<li class="nav-item">.*?각종 장부.*?</li>)'
        
        if ($content -match $regex) {
            $newContent = $content -replace $regex, '$2`r`n            $1'
            [System.IO.File]::WriteAllText($file.FullName, $newContent, [System.Text.Encoding]::UTF8)
            Write-Host "Updated: $($file.Name)"
            $successCount++
        } else {
            Write-Host "Skipped (pattern not found): $($file.Name)"
            $failCount++
        }
    } catch {
        Write-Host "Error in $($file.Name): $($_.Exception.Message)"
        $failCount++
    }
}

Write-Host "`nSummary: Success=$successCount, Failed/Skipped=$failCount"
