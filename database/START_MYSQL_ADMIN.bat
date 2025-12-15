@echo off
echo ========================================
echo Starting MySQL Service (Admin Required)
echo ========================================
echo.

REM Check if running as admin
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo This script requires Administrator privileges.
    echo Right-click this file and select "Run as administrator"
    echo.
    pause
    exit /b 1
)

echo Starting MySQL80 service...
net start MySQL80

if %errorLevel% equ 0 (
    echo.
    echo ========================================
    echo SUCCESS! MySQL is now running
    echo ========================================
    echo.
    echo You can now:
    echo 1. Open MySQL Workbench
    echo 2. Connect to localhost:3306
    echo 3. Run the setup-database-workbench.sql script
    echo.
) else (
    echo.
    echo ========================================
    echo ERROR: Could not start MySQL
    echo ========================================
    echo.
    echo Possible solutions:
    echo 1. MySQL might not be installed correctly
    echo 2. Check Windows Services to see MySQL status
    echo 3. Try reinstalling MySQL Server
    echo.
)

pause
