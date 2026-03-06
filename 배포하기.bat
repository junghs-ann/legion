@echo off
echo.
echo ==========================================
echo    레지오 마리애 관리시스템 배포 도우미
echo ==========================================
echo.
echo 1단계: 파이어베이스 로그인 확인 중...
call npx firebase-tools login

echo.
echo 2단계: 호스팅 서버로 업로드(배포) 중...
call npx firebase-tools deploy --only hosting

echo.
echo 3단계: 배포가 완료되었습니다!
echo 아래 주소로 접속해 보세요:
echo https://legion-f319a.web.app
echo.
echo ==========================================
pause
