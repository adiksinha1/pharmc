@echo off
REM This script must be run as Administrator
REM Right-click and select "Run as administrator"

echo.
echo ========================================
echo  STARTING MYSQL AND FIXING EVERYTHING
echo ========================================
echo.

REM Kill any node processes
echo Killing existing node processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2

REM Start MySQL
echo Starting MySQL80 service...
net start MySQL80
if %errorlevel% equ 0 (
    echo SUCCESS: MySQL80 started
    timeout /t 3
) else (
    echo FAILED: Could not start MySQL80
    echo Make sure you're running as Administrator!
    pause
    exit /b 1
)

REM Verify MySQL is running
echo Verifying MySQL connection...
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -e "SELECT 1;" >nul 2>&1
if %errorlevel% equ 0 (
    echo SUCCESS: MySQL is responding
) else (
    echo WARNING: Could not verify MySQL (might need password)
)

echo.
echo ========================================
echo  DONE! Now do this:
echo ========================================
echo.
echo 1. Go to project folder in terminal
echo 2. Run: npm run dev
echo 3. Wait for message: "Using MySQL storage"
echo 4. Open http://localhost:5173/signup
echo 5. Try signing up - it will work now!
echo.
pause
