@echo off
echo.
echo ========================================
echo   CLEARING MYSQL DATABASE NOW
echo ========================================
echo.

cd /d "%~dp0"

echo Finding MySQL...
set MYSQL_PATH=""

if exist "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" (
    set MYSQL_PATH="C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
)
if exist "C:\Program Files (x86)\MySQL\MySQL Server 8.0\bin\mysql.exe" (
    set MYSQL_PATH="C:\Program Files (x86)\MySQL\MySQL Server 8.0\bin\mysql.exe"
)
if exist "C:\xampp\mysql\bin\mysql.exe" (
    set MYSQL_PATH="C:\xampp\mysql\bin\mysql.exe"
)

if %MYSQL_PATH%=="" (
    echo ERROR: MySQL not found!
    echo Please run: mysql -u root pharmac_db ^< CLEAR_ALL_USERS.sql
    pause
    exit /b 1
)

echo Found: %MYSQL_PATH%
echo.
echo Clearing users table...

%MYSQL_PATH% -u root pharmac_db < CLEAR_ALL_USERS.sql

if errorlevel 1 (
    echo.
    echo ERROR: Failed to clear database
    echo Try running as Administrator or check MySQL password
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   SUCCESS! Database cleared!
echo ========================================
echo.
echo NEXT STEPS:
echo   1. Press F12 in your browser
echo   2. Console: localStorage.clear(); location.reload();
echo   3. Try signup with: test@example.com
echo.
pause
