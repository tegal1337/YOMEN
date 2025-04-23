@echo off
setlocal enabledelayedexpansion

:: Get current directory
set "CURRENT_DIR=%cd%"

:: Relaunch as admin if not already
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo Requesting admin access...
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

echo ====================================
echo Running as Administrator in: %CURRENT_DIR%
cd /d "%CURRENT_DIR%"

:: Check Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js is not installed. Get it from https://nodejs.org/
    pause
    exit /b
)

:: Display Node version
for /f "tokens=*" %%i in ('node -v') do set "NODE_VER=%%i"
echo Detected Node.js Version: %NODE_VER%
echo ====================================

:: Run npm install
echo Running npm install...
npm install && npm start
if %errorlevel% neq 0 (
    echo npm install failed.
    pause
    exit /b
)

:: Optional audit warning
echo ------------------------------------
echo Note: Run `npm audit fix` or `npm audit fix --force` to resolve vulnerabilities.
echo ------------------------------------


:: Final pause to keep window open
echo.
echo Script finished. Press any key to close...
pause >nul
