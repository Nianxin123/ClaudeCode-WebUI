Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "cmd.exe /c cd /d ""e:\coder\claude_code\AI使用工具"" && pm2 resurrect", 0, False
