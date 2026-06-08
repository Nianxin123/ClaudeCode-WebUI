@echo off
chcp 65001 >nul
title Stop Claude Code Web UI

echo.
echo ========================================
echo     Claude Code Web UI
echo     Stopping server...
echo ========================================
echo.

REM Find process using port 3000
set PID=
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do (
    set PID=%%a
)

if "%PID%"=="" (
    echo [Info] No running server found on port 3000.
) else (
    echo [Stop] Found server process (PID: %PID%^), stopping...
    taskkill /F /PID %PID% >nul 2>nul
    if %errorlevel% equ 0 (
        echo [Done] Server stopped!
    ) else (
        echo [Error] Failed to stop process.
    )
)

echo.
pause
