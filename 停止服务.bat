@echo off
chcp 65001 >nul
title Stop Claude Code Web UI

echo.
echo ========================================
echo     Claude Code Web UI
echo     Stopping server...
echo ========================================
echo.

REM Stop PM2 process
pm2 stop all
pm2 delete all

echo.
echo [Done] Server stopped!
echo.
pause
