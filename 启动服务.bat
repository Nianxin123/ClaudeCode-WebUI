@echo off
chcp 65001 >nul
title Claude Code Web UI

echo.
echo ========================================
echo     Claude Code Web UI
echo     Starting server...
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [Error] Node.js not found!
    echo Please install Node.js from: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

REM Check if node_modules exists
if not exist "node_modules" (
    echo [Info] First run, installing dependencies...
    call npm install
    echo.
)

REM Start server
echo [Start] Starting server...
echo [Access] Open browser: http://localhost:3000
echo [Stop] Press Ctrl+C to stop
echo.
call npm start

pause
