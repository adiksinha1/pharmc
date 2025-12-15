@echo off
REM =========================================
REM  COMPLETE SYSTEM FIX - RUN AS ADMIN
REM =========================================
REM Right-click this file and select "Run as administrator"

setlocal enabledelayedexpansion

echo.
echo =========================================
echo  AUTOMATIC FIX - STEP 1: MYSQL
echo =========================================
echo.

REM Kill node processes
echo Killing node processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2

REM Start MySQL
echo Starting MySQL80...
net start MySQL80
if %errorlevel% equ 0 (
    echo SUCCESS: MySQL80 started
    timeout /t 3
) else (
    echo WARNING: Could not start MySQL (might need password)
    timeout /t 2
)

REM Clear users file
echo.
echo Clearing users.json...
(
    echo []
) > "%cd%\server\users.json"
echo Done!

echo.
echo =========================================
echo  STEP 2: START YOUR APP
echo =========================================
echo.
echo Next, run these commands in VS Code terminal:
echo.
echo   npm run dev
echo.
echo Wait for message: "Using MySQL storage (mysql2)"
echo.

echo =========================================
echo  STEP 3: CLEAR BROWSER
echo =========================================
echo.
echo In browser F12 Console, run:
echo   localStorage.clear(); sessionStorage.clear(); location.reload();
echo.

echo =========================================
echo  STEP 4: SIGNUP
echo =========================================
echo.
echo Use fresh email (not the old one!) like:
echo   test123@example.com
echo.
echo Click "Create account"
echo.
echo SUCCESS!
echo.

pause
