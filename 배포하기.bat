@echo off
echo.
echo ==========================================
echo    Legion Management System Deploy Tool
echo ==========================================
echo.

echo STEP 1: Auto Update Deployment Version (Cache Busting)...
powershell -ExecutionPolicy Bypass -File update_cache.ps1

echo.
echo STEP 2: Checking Firebase Login...
call npx firebase-tools login

echo.
echo STEP 3: Uploading to Hosting Server (Deploying)...
call npx firebase-tools deploy --only hosting

echo.
echo STEP 4: Deployment Completed!
echo Please check your mobile phone now:
echo https://legion-f319a.web.app
echo.
echo ==========================================
pause
