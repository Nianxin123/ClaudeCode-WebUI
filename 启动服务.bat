@echo off
chcp 65001 >nul
title Claude Code Web UI

echo.
echo ╔══════════════════════════════════════════╗
echo ║     Claude Code Web UI                  ║
echo ║     正在启动服务...                       ║
echo ╚══════════════════════════════════════════╝
echo.

REM 检查Node.js是否安装
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [错误] 未检测到 Node.js，请先安装 Node.js
    echo 下载地址: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

REM 检查node_modules是否存在
if not exist "node_modules" (
    echo [提示] 首次运行，正在安装依赖...
    call npm install
    echo.
)

REM 启动服务
echo [启动] 正在启动服务...
echo [访问] 请在浏览器中打开: http://localhost:3000
echo [停止] 按 Ctrl+C 停止服务
echo.
call npm start

pause
