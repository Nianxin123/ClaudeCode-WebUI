# Claude Code Web UI

一个连接本地 Claude Code 的 Web 界面，提供友好的聊天交互体验。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0-green.svg)

## ✨ 功能特性

- 🤖 **AI 对话** - 与 Claude Code 进行自然语言对话
- 📎 **文件上传** - 支持上传图片、PDF、文档等文件
- 📋 **粘贴上传** - 直接粘贴文件即可上传
- 📝 **Markdown 渲染** - AI 响应支持 Markdown 格式和代码高亮
- 📊 **Mermaid 图表** - 支持流程图、时序图等图表渲染
- 💬 **对话历史** - 自动保存和加载对话记录
- 🎨 **主题切换** - 支持深色/浅色主题
- 📱 **响应式设计** - 支持桌面和移动设备

## 📋 前置要求

- **Node.js** 14.0 或更高版本
- **Claude Code CLI** 工具（已安装并配置）

## 🚀 快速开始

### Windows 用户（推荐）

1. **下载项目**
   - 点击 Code → Download ZIP
   - 解压到任意目录

2. **双击运行**
   - 双击 `启动服务.bat`
   - 等待依赖自动安装
   - 打开浏览器访问 http://localhost:3000

### 手动安装

```bash
# 1. 克隆项目
git clone https://github.com/your-username/claude-code-web-ui.git
cd claude-code-web-ui

# 2. 安装依赖
npm install

# 3. 启动服务
npm start

# 4. 访问界面
# 打开浏览器访问: http://localhost:3000
```

## 📖 使用说明

### 基本对话
1. 在输入框中输入消息
2. 按 `Enter` 键或点击发送按钮
3. 等待 AI 响应

### 上传文件
**方式一：点击上传**
1. 点击左侧的 📎 按钮
2. 选择要上传的文件（支持多选）
3. 文件会显示在输入框上方

**方式二：粘贴上传**
1. 复制文件（Ctrl+C）
2. 点击输入框
3. 粘贴（Ctrl+V）

### 快捷键
| 快捷键 | 功能 |
|--------|------|
| `Enter` | 发送消息 |
| `Shift + Enter` | 换行 |
| `Ctrl + V` | 粘贴上传文件 |

### 其他功能
- ➕ **新对话** - 开始新的对话
- 🗑️ **清空历史** - 清除所有对话记录
- 📥 **导出对话** - 将对话导出为 Markdown 文件
- 🌓 **切换主题** - 深色/浅色主题切换

## 📁 项目结构

```
claude-code-web-ui/
├── public/              # 前端静态文件
│   ├── index.html       # 主页面
│   ├── style.css        # 样式文件
│   ├── app.js           # 前端逻辑
│   └── 头像/            # 头像图片
├── workspace/           # AI 工作目录
│   └── CLAUDE.md        # Claude Code 配置
├── server.js            # 后端服务器
├── package.json         # 项目配置
├── start.bat            # Windows 启动脚本
├── autostart.vbs        # 开机自启脚本
└── README.md            # 说明文档
```

## 🔧 API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/chat | 发送消息 |
| POST | /api/upload | 上传文件 |
| GET | /api/history | 获取历史记录 |
| DELETE | /api/history | 清空历史记录 |
| GET | /api/health | 健康检查 |

## ❓ 常见问题

### Q: 启动时提示 "端口已被占用"
```bash
# 查找占用端口的进程
netstat -ano | findstr :3000

# 终止进程（替换 <PID>）
taskkill /F /PID <PID>
```

### Q: 无法连接到 AI
1. 检查是否已安装 Claude Code
2. 检查 API Key 是否配置正确
3. 检查网络连接

### Q: 如何修改端口号？
编辑 `server.js` 文件，修改 PORT 变量：
```javascript
const PORT = 3000;  // 改为你想要的端口号
```

### Q: 如何设置开机自启？
运行 `pm2 save` 后，将 `autostart.vbs` 放入启动文件夹：
```
%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup
```

## 🛠️ 技术栈

- **后端**: Node.js + Express
- **前端**: HTML5 + CSS3 + Vanilla JavaScript
- **Markdown**: marked.js
- **代码高亮**: highlight.js
- **图表渲染**: Mermaid.js
- **进程管理**: PM2

## 📄 许可证

[MIT License](LICENSE)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 🙏 致谢

- [Claude Code](https://docs.anthropic.com/claude-code) - Anthropic 官方 CLI 工具
- [Express](https://expressjs.com/) - Node.js Web 框架
- [Marked](https://marked.js.org/) - Markdown 解析器
- [Mermaid](https://mermaid.js.org/) - 图表渲染库
