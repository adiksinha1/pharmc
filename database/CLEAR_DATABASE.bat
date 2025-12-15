@echo off
echo.
echo ========================================
echo   CLEARING MYSQL DATABASE
echo ========================================
echo.

cd /d "%~dp0"

"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root pharmac_db < CLEAR_ALL_USERS.sql

if errorlevel 1 (
    echo.
    echo Password required? Try this:
    "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p pharmac_db < CLEAR_ALL_USERS.sql
)

echo.
echo ========================================
echo   DONE! Check above for success/error
echo ========================================
echo.
pause
