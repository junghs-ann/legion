$version = "20260303_1255_fix"
$files = Get-ChildItem -Filter *.html
foreach ($file in $files) {
    if ($file.Name -match "node_modules") { continue }
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    $newContent = [regex]::Replace($content, 'styles\.css(\?v=[a-zA-Z0-9_.]+)?', "styles.css?v=$version")
    $newContent = [regex]::Replace($newContent, 'script\.js(\?v=[a-zA-Z0-9_.]+)?', "script.js?v=$version")
    $newContent = [regex]::Replace($newContent, 'accounting_styles\.css(\?v=[a-zA-Z0-9_.]+)?', "accounting_styles.css?v=$version")
    if ($content -ne $newContent) {
        # Using UTF8 without BOM (standard for web)
        $Utf8NoBomEncoding = New-Object System.Text.UTF8Encoding $False
        [System.IO.File]::WriteAllText($file.FullName, $newContent, $Utf8NoBomEncoding)
        Write-Host "Updated $($file.Name)"
    }
}
Write-Host "Done!"
