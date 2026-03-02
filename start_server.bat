@echo off
echo Starting Legion App Server...
echo.
echo Please wait while the server starts.
echo Once started, you can access the app at: http://localhost:8080
echo.
call npm install
call npm start
pause
