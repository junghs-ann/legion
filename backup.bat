@echo off
@chcp 949 > nul
echo.
echo ========================================
echo   레지오 마리애 관리시스템 자동 백업
echo ========================================
echo.

:: 1. 변경된 파일 상자에 담기
echo [1/3] 변경된 파일들을 정리하고 있습니다...
git add .
if %errorlevel% neq 0 (
    echo [오류] 파일을 정리하는 중(git add) 문제가 발생했습니다.
    pause
    exit /b
)

:: 2. 날짜와 시간 구하기 (기본 커밋 메시지용)
set YYYY=%date:~0,4%
set MM=%date:~5,2%
set DD=%date:~8,2%
set HH=%time:~0,2%
if "%HH:~0,1%"==" " set HH=0%HH:~1,1%
set MI=%time:~3,2%
set SS=%time:~6,2%
set DEFAULT_MSG=Backup_%YYYY%-%MM%-%DD%_%HH%%MI%%SS%

:: 3. 확정 및 메시지 남기기
echo [2/3] 백업 메시지를 기록하고 있습니다...
git commit -m "%DEFAULT_MSG%"
if %errorlevel% neq 0 (
    echo.
    echo [알림] 새로 백업할 변경 사항이 없습니다.
    echo.
    pause
    exit /b
)

:: 4. 서버로 올리기
echo [3/3] GitHub 서버로 소스를 전송하고 있습니다...
git push origin main
if %errorlevel% neq 0 (
    echo.
    echo [오류] 전송 중(git push) 문제가 발생했습니다. 
    echo 인터넷 연결이나 GitHub 로그인 상태를 확인해 주세요.
    echo.
    pause
    exit /b
)

echo.
echo ========================================
echo   백업 완료! 모든 소스가 안전하게 저장되었습니다.
echo   기록된 메시지: %DEFAULT_MSG%
echo ========================================
echo.
pause
