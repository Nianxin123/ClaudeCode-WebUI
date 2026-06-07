# Claude Code Web UI

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-%3E%3D14.0-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.18-000000?style=flat-square&logo=express&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)

**一个现代化的 Claude Code Web 界面，让 AI 对话更简单、更直观**

</div>

---

## 功能特性

| 功能 | 说明 |
|------|------|
| AI 对话 | 与 Claude Code 进行自然语言对话 |
| 文件上传 | 支持图片、PDF、文档等多种格式 |
| 粘贴上传 | 复制文件后直接粘贴即可上传 |
| Mermaid 图表 | 支持流程图、时序图、甘特图等 |
| Markdown | 完整的 Markdown 渲染和代码高亮 |
| 主题切换 | 深色/浅色主题一键切换 |

---

## 快速开始

### 前置要求

- [Node.js](https://nodejs.org/) >= 14.0
- [Claude Code](https://docs.anthropic.com/claude-code) CLI 工具

### 安装步骤

```bash
# 1. 克隆项目
git clone https://github.com/Nianxin123/ClaudeCode-WebUI.git
cd ClaudeCode-WebUI

# 2. 安装依赖
npm install

# 3. 启动服务
npm start
```

### Windows 用户

双击 `启动服务.bat` 即可一键启动。

---

## 项目结构

```
ClaudeCode-WebUI/
├── public/              # 前端静态文件
│   ├── index.html
│   ├── style.css
│   ├── app.js
│   └── 头像/            # 头像图片
├── workspace/           # AI 工作目录
│   └── CLAUDE.md        # Claude Code 配置
├── server.js            # 后端服务器
├── package.json
├── 启动服务.bat         # 启动脚本
└── 停止服务.bat         # 停止脚本
```

---

## 配置说明

**修改端口号：** 编辑 `server.js` 中的 `PORT` 变量

**自定义头像：** 将图片放入 `public/头像/` 目录

**AI 行为配置：** 编辑 `workspace/CLAUDE.md`

---

## 常见问题

**端口被占用：**
```bash
netstat -ano | findstr :3000
taskkill /F /PID <PID>
```

**无法连接 AI：** 确认已安装 Claude Code 并配置 API Key

**如何更新：**
```bash
git pull origin master
npm install
```

---

## 技术栈

| 类别 | 技术 |
|------|------|
| 后端 | Node.js + Express |
| 前端 | HTML5 + CSS3 + JavaScript |
| Markdown | marked.js |
| 图表 | Mermaid.js |

---

## 许可证

[MIT License](LICENSE)
