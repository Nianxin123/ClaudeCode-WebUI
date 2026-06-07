# 🤖 Claude Code Web UI

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-%3E%3D14.0-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.18-000000?style=flat-square&logo=express&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)
![PRs](https://img.shields.io/badge/PRs-Welcome-brightgreen?style=flat-square)

**一个现代化的 Claude Code Web 界面，让 AI 对话更简单、更直观**

[快速开始](#-快速开始) • [功能特性](#-功能特性) • [使用说明](#-使用说明) • [常见问题](#-常见问题)

</div>

---

## 📸 功能预览

- 🎨 **现代 UI 设计** - 深色/浅色主题切换
- 💬 **实时对话** - 流式响应，打字机效果
- 📎 **文件上传** - 支持拖拽、粘贴上传
- 📊 **图表渲染** - 支持 Mermaid 流程图、时序图
- 📝 **Markdown** - 完整的 Markdown 渲染支持
- 🎭 **自定义头像** - 用户和 AI 独立头像

---

## ✨ 功能特性

| 功能 | 说明 |
|------|------|
| 🤖 AI 对话 | 与 Claude Code 进行自然语言对话 |
| 📎 文件上传 | 支持图片、PDF、文档等多种格式 |
| 📋 粘贴上传 | 复制文件后直接粘贴即可上传 |
| 📊 Mermaid 图表 | 支持流程图、时序图、甘特图等 |
| 📝 Markdown | 完整的 Markdown 渲染和代码高亮 |
| 🌓 主题切换 | 深色/浅色主题一键切换 |
| 💾 历史记录 | 自动保存对话历史 |
| 📥 导出功能 | 一键导出对话为 Markdown 文件 |

---

## 🚀 快速开始

### 方式一：一键启动（Windows）

```bash
# 1. 下载项目
git clone https://github.com/Nianxin123/ClaudeCode-WebUI.git

# 2. 进入目录
cd ClaudeCode-WebUI

# 3. 双击运行
启动服务.bat
```

### 方式二：手动安装

```bash
# 1. 克隆项目
git clone https://github.com/Nianxin123/ClaudeCode-WebUI.git
cd ClaudeCode-WebUI

# 2. 安装依赖
npm install

# 3. 启动服务
npm start
```

### 方式三：使用 PM2（推荐生产环境）

```bash
# 安装 PM2
npm install pm2 -g

# 启动服务
pm2 start server.js --name claude-code-web-ui

# 保存并设置开机自启
pm2 save
pm2 startup
```

---

## 📋 前置要求

| 软件 | 版本 | 说明 |
|------|------|------|
| [Node.js](https://nodejs.org/) | >= 14.0 | JavaScript 运行环境 |
| [Claude Code](https://docs.anthropic.com/claude-code) | 最新版 | Anthropic CLI 工具 |

### 安装 Claude Code

```bash
# 全局安装
npm install -g @anthropic-ai/claude-code

# 配置 API Key
claude config set apiKey YOUR_API_KEY

# 验证安装
claude --version
```

---

## 📁 项目结构

```
ClaudeCode-WebUI/
├── public/                 # 前端静态文件
│   ├── index.html         # 主页面
│   ├── style.css          # 样式文件
│   ├── app.js             # 前端逻辑
│   └── 头像/              # 头像图片
│       ├── image.png      # AI 头像
│       └── my_avatar.jpg  # 用户头像
├── workspace/             # AI 工作目录
│   └── CLAUDE.md          # Claude Code 配置
├── server.js              # 后端服务器
├── package.json           # 项目配置
├── 启动服务.bat           # Windows 启动脚本
├── 停止服务.bat           # Windows 停止脚本
└── README.md              # 项目说明
```

---

## ⚙️ 配置说明

### 修改端口号

编辑 `server.js` 文件：

```javascript
const PORT = 3000;  // 修改为你想要的端口号
```

### 自定义头像

将你的头像放入 `public/头像/` 目录：

- `image.png` - AI 助手头像
- `my_avatar.jpg` - 用户头像

### Claude Code 配置

编辑 `workspace/CLAUDE.md` 文件，自定义 AI 行为：

```markdown
# Claude Code 工作空间配置

## 图表生成规则
当用户要求生成图表时，必须使用 Mermaid 语法。
```

---

## 🎯 API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| `POST` | `/api/chat` | 发送消息 |
| `POST` | `/api/upload` | 上传文件 |
| `GET` | `/api/history` | 获取历史记录 |
| `DELETE` | `/api/history` | 清空历史记录 |
| `GET` | `/api/health` | 健康检查 |

---

## ❓ 常见问题

### Q: 启动时提示"端口已被占用"

```bash
# 查找占用端口的进程
netstat -ano | findstr :3000

# 终止进程（替换 <PID>）
taskkill /F /PID <PID>
```

### Q: 无法连接到 AI

1. ✅ 确认已安装 Claude Code：`claude --version`
2. ✅ 确认已配置 API Key
3. ✅ 检查网络连接

### Q: 文件上传失败

- 检查文件大小是否超过 50MB 限制
- 确认文件格式受支持

### Q: 如何设置开机自启？

```bash
# 使用 PM2
pm2 save
pm2 startup

# 或将 autostart.vbs 放入启动文件夹
# %APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup
```

### Q: 如何更新到最新版本？

```bash
git pull origin master
npm install
pm2 restart claude-code-web-ui
```

---

## 🛠️ 技术栈

<div align="center">

| 类别 | 技术 |
|------|------|
| **后端** | Node.js + Express |
| **前端** | HTML5 + CSS3 + JavaScript |
| **Markdown** | marked.js |
| **代码高亮** | highlight.js |
| **图表渲染** | Mermaid.js |
| **进程管理** | PM2 |

</div>

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本项目
2. 创建特性分支：`git checkout -b feature/AmazingFeature`
3. 提交更改：`git commit -m 'Add some AmazingFeature'`
4. 推送到分支：`git push origin feature/AmazingFeature`
5. 提交 Pull Request

---

## 📄 许可证

本项目基于 [MIT License](LICENSE) 开源。

---

## 🙏 致谢

- [Claude Code](https://docs.anthropic.com/claude-code) - Anthropic 官方 CLI 工具
- [Express](https://expressjs.com/) - Fast, unopinionated, minimalist web framework
- [Marked](https://marked.js.org/) - Markdown parser and compiler
- [Mermaid](https://mermaid.js.org/) - Generation of diagrams

---

<div align="center">

**如果这个项目对你有帮助，请给个 ⭐ Star 支持一下！**

</div>
