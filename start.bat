@echo off
cd /d "e:\coder\claude_code\AI使用工具"
pm2 start server.js --name claude-code-web-ui
pm2 save
