# Claude Code Web UI

一个连接本地Claude Code的Web界面，提供友好的聊天交互体验。

## 功能特性

- ✅ **AI对话** - 与Claude Code进行自然语言对话
- ✅ **文件上传** - 支持上传图片、PDF、文档等文件
- ✅ **Markdown渲染** - AI响应支持Markdown格式和代码高亮
- ✅ **对话历史** - 自动保存和加载对话记录
- ✅ **响应式设计** - 支持桌面和移动设备

## 系统要求

- Node.js 14.0 或更高版本
- Claude Code CLI 工具（已安装并配置）

## 安装步骤

1. **安装依赖**
   ```bash
   cd "e:\coder\claude_code\AI使用工具"
   npm install
   ```

2. **确保Claude Code已安装**
   ```bash
   claude --version
   ```
   如果未安装，请参考 [Claude Code官方文档](https://docs.anthropic.com/claude-code) 进行安装。

3. **启动服务**
   ```bash
   npm start
   ```

4. **访问界面**
   打开浏览器访问: http://localhost:3000

## 使用说明

### 基本对话
1. 在输入框中输入消息
2. 按 `Enter` 键或点击发送按钮
3. 等待AI响应

### 上传文件
1. 点击左侧的 📎 按钮
2. 选择要上传的文件（支持多选）
3. 文件会显示在输入框上方
4. 发送消息时文件会一起发送

### 快捷键
- `Enter` - 发送消息
- `Shift + Enter` - 换行

### 其他功能
- ➕ **新对话** - 开始新的对话
- 🗑️ **清空历史** - 清除所有对话记录
- 📥 **导出对话** - 将对话导出为Markdown文件

## 项目结构

```
AI使用工具/
├── server.js          # 后端服务器
├── package.json       # 项目配置
├── public/            # 前端文件
│   ├── index.html     # 主页面
│   ├── style.css      # 样式文件
│   └── app.js         # 前端逻辑
├── uploads/           # 上传文件存储
└── README.md          # 本文件
```

## API接口

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/chat | 发送消息 |
| POST | /api/upload | 上传文件 |
| GET | /api/history | 获取历史记录 |
| DELETE | /api/history | 清空历史记录 |
| GET | /api/health | 健康检查 |

## 故障排除

### 无法连接到服务器
- 确保服务器正在运行
- 检查端口3000是否被占用

### Claude Code不响应
- 确认Claude Code CLI已安装
- 检查Claude Code是否已登录
- 查看控制台错误信息

## 技术栈

- **后端**: Node.js + Express
- **前端**: HTML5 + CSS3 + Vanilla JavaScript
- **Markdown**: marked.js
- **代码高亮**: highlight.js

## 许可证

MIT License
