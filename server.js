const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Claude Code专属工作目录 - 用户只能访问这个目录
const workspaceDir = path.join(__dirname, 'workspace');
if (!fs.existsSync(workspaceDir)) {
  fs.mkdirSync(workspaceDir, { recursive: true });
}

// 服务启动时清理工作区中的旧文件（保留CLAUDE.md配置文件）
function cleanWorkspace() {
  try {
    const files = fs.readdirSync(workspaceDir);
    let cleanedCount = 0;

    files.forEach(file => {
      // 保留CLAUDE.md配置文件和.claude目录
      if (file === 'CLAUDE.md' || file === '.claude') {
        return;
      }

      const filePath = path.join(workspaceDir, file);
      const stat = fs.statSync(filePath);

      if (stat.isFile()) {
        fs.unlinkSync(filePath);
        cleanedCount++;
        console.log(`已删除旧文件: ${file}`);
      } else if (stat.isDirectory()) {
        fs.rmSync(filePath, { recursive: true, force: true });
        cleanedCount++;
        console.log(`已删除旧目录: ${file}`);
      }
    });

    if (cleanedCount > 0) {
      console.log(`工作区清理完成，共删除 ${cleanedCount} 个项目`);
    } else {
      console.log('工作区无需清理');
    }
  } catch (error) {
    console.error('清理工作区失败:', error);
  }
}

// 启动时清理工作区
cleanWorkspace();

app.use('/workspace', express.static(workspaceDir));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, workspaceDir),
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const safeName = Buffer.from(file.originalname, 'latin1').toString('utf8');
    cb(null, `${timestamp}_${safeName}`);
  }
});

const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

let conversationHistory = [];

// 文件上传接口
app.post('/api/upload', upload.array('files', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: '没有上传文件' });
    }
    const fileInfo = req.files.map(file => ({
      originalname: Buffer.from(file.originalname, 'latin1').toString('utf8'),
      filename: file.filename,
      path: file.path,
      url: `/workspace/${file.filename}`,
      size: file.size,
      mimetype: file.mimetype
    }));
    res.json({ success: true, files: fileInfo });
  } catch (error) {
    res.status(500).json({ error: '文件上传失败' });
  }
});

// 构建包含历史上下文的prompt
function buildPromptWithHistory(newMessage, files = []) {
  let prompt = '';

  // 添加对话历史作为上下文
  if (conversationHistory.length > 0) {
    prompt += '以下是之前的对话历史，请参考上下文进行回答：\n\n';

    // 只取最近的10轮对话（避免token过多）
    const recentHistory = conversationHistory.slice(-20);

    recentHistory.forEach(msg => {
      if (msg.role === 'user') {
        prompt += `用户: ${msg.content}\n`;
      } else {
        prompt += `助手: ${msg.content}\n`;
      }
    });

    prompt += '\n---\n\n';
  }

  // 添加新消息
  prompt += `用户的新问题: ${newMessage}`;

  // 添加文件信息
  if (files.length > 0) {
    prompt += '\n\n请分析以下文件:\n';
    files.forEach(file => prompt += `- ${file}\n`);
  }

  return prompt;
}

// 调用Claude Code - 在专属工作目录中运行
function callClaude(prompt) {
  return new Promise((resolve, reject) => {
    const child = spawn('claude', ['-p', '--dangerously-skip-permissions'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: true,
      cwd: workspaceDir  // 在专属工作目录中运行，用户无法访问项目其他文件
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', data => stdout += data.toString('utf-8'));
    child.stderr.on('data', data => stderr += data.toString('utf-8'));

    child.stdin.write(prompt);
    child.stdin.end();

    child.on('close', () => {
      resolve(stdout.trim() || stderr.trim() || '无响应');
    });

    child.on('error', reject);
  });
}

// 对话接口
app.post('/api/chat', async (req, res) => {
  try {
    const { message, files } = req.body;
    if (!message && (!files || files.length === 0)) {
      return res.status(400).json({ error: '请输入消息或上传文件' });
    }

    // 记录用户消息
    conversationHistory.push({
      role: 'user',
      content: message,
      files: files || [],
      timestamp: new Date().toISOString()
    });

    // 构建包含历史上下文的prompt
    const filePaths = files ? files.map(f => f.path).filter(Boolean) : [];
    const fullPrompt = buildPromptWithHistory(message || '', filePaths);

    let response;
    try {
      response = await callClaude(fullPrompt);
    } catch (error) {
      console.error('Claude Code调用失败:', error);
      response = `Claude Code调用失败: ${error.message}`;
    }

    // 记录AI响应
    conversationHistory.push({
      role: 'assistant',
      content: response,
      timestamp: new Date().toISOString()
    });

    res.json({ success: true, response, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('处理请求失败:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 获取对话历史
app.get('/api/history', (req, res) => res.json(conversationHistory));

// 清空对话历史
app.delete('/api/history', (req, res) => {
  conversationHistory = [];
  res.json({ success: true });
});

// 健康检查
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.listen(PORT, () => {
  console.log(`Claude Code Web UI 已启动: http://localhost:${PORT}`);
});
