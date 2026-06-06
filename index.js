#!/usr/bin/env node

// Claude Code Web UI 启动入口
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// 获取程序所在目录（支持打包后的路径）
const appDir = path.dirname(process.execPath);
const isPkg = process.pkg !== undefined;

// 如果是打包后的版本，需要先释放文件
if (isPkg) {
  console.log('正在初始化...');

  // 创建必要的目录
  const dirs = ['workspace', 'uploads'];
  dirs.forEach(dir => {
    const dirPath = path.join(appDir, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  });

  // 释放 CLAUDE.md 到 workspace
  const claudeMdSource = path.join(__dirname, 'workspace', 'CLAUDE.md');
  const claudeMdTarget = path.join(appDir, 'workspace', 'CLAUDE.md');

  if (fs.existsSync(claudeMdSource) && !fs.existsSync(claudeMdTarget)) {
    fs.copyFileSync(claudeMdSource, claudeMdTarget);
    console.log('已释放配置文件');
  }
}

// 启动服务器
console.log(`
╔══════════════════════════════════════════╗
║     Claude Code Web UI                  ║
║     访问地址: http://localhost:3000       ║
╚══════════════════════════════════════════╝
`);

const serverPath = isPkg
  ? path.join(appDir, 'server.js')
  : path.join(__dirname, 'server.js');

require(serverPath);
