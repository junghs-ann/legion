@echo off
echo [1/3] Git Add...
git add .
echo [2/3] Git Commit...
git commit -m "Backup_Auto"
if %errorlevel% neq 0 (
    echo No changes to backup.
) else (
    echo [3/3] Git Push...
    git push origin main
)
pause