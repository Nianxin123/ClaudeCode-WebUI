// 全局变量
let uploadedFiles = [];
let isProcessing = false;

const API_BASE = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMarked();
  initMermaid();
  loadHistory();
  focusInput();
  initPasteUpload();
});

function initMarked() {
  marked.setOptions({
    highlight: function(code, lang) {
      // Mermaid代码块不进行高亮，留给后续渲染
      if (lang === 'mermaid') {
        return code;
      }
      if (lang && hljs.getLanguage(lang)) {
        try { return hljs.highlight(code, { language: lang }).value; } catch (e) {}
      }
      return hljs.highlightAuto(code).value;
    },
    breaks: true,
    gfm: true
  });
}

function initMermaid() {
  mermaid.initialize({
    startOnLoad: false,
    theme: 'dark',
    themeVariables: {
      primaryColor: '#6366f1',
      primaryTextColor: '#e4e4e7',
      primaryBorderColor: '#4f46e5',
      lineColor: '#a1a1aa',
      secondaryColor: '#1e1e22',
      tertiaryColor: '#27272a',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    flowchart: { useMaxWidth: true, htmlLabels: true },
    sequence: { useMaxWidth: true },
    gantt: { useMaxWidth: true }
  });
}

// 渲染Mermaid图表
async function renderMermaid(container) {
  const mermaidBlocks = container.querySelectorAll('code.language-mermaid');

  for (const block of mermaidBlocks) {
    const pre = block.parentElement;
    const code = block.textContent;

    try {
      const id = 'mermaid-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
      const { svg } = await mermaid.render(id, code);

      const wrapper = document.createElement('div');
      wrapper.className = 'mermaid-wrapper';
      wrapper.innerHTML = svg;

      pre.replaceWith(wrapper);
    } catch (error) {
      console.error('Mermaid渲染失败:', error);
      pre.className = 'mermaid-error';
      pre.innerHTML = `<div class="mermaid-error-msg">⚠️ Mermaid语法错误</div><code>${escapeHtml(code)}</code>`;
    }
  }
}

function focusInput() {
  document.getElementById('messageInput').focus();
}

// 初始化粘贴上传功能
function initPasteUpload() {
  const messageInput = document.getElementById('messageInput');

  messageInput.addEventListener('paste', async (event) => {
    // 获取剪贴板中的文件
    const clipboardData = event.clipboardData || window.clipboardData;
    const items = clipboardData.items;

    const files = [];
    for (let i = 0; i < items.length; i++) {
      // 检查是否是文件类型
      if (items[i].kind === 'file') {
        const file = items[i].getAsFile();
        if (file) {
          files.push(file);
        }
      }
    }

    // 如果有文件，阻止默认粘贴行为并上传文件
    if (files.length > 0) {
      event.preventDefault();

      // 创建 FormData 并上传文件
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));

      try {
        const preview = document.getElementById('filePreview');
        preview.style.display = 'block';
        document.getElementById('fileList').innerHTML = '<div class="file-item">⏳ 上传中...</div>';

        const response = await fetch(`${API_BASE}/api/upload`, {
          method: 'POST',
          body: formData
        });
        const data = await response.json();

        if (data.success && data.files) {
          data.files.forEach(file => {
            if (!uploadedFiles.some(f => f.filename === file.filename)) {
              uploadedFiles.push(file);
            }
          });
          console.log('粘贴上传成功:', data.files.length, '个文件');
        } else {
          alert('文件上传失败: ' + (data.error || '未知错误'));
        }
        updateFilePreview();
      } catch (error) {
        console.error('粘贴上传失败:', error);
        alert('文件上传失败，请重试');
        updateFilePreview();
      }
    }
  });
}

// 主题切换功能
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  setTheme(savedTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
  localStorage.setItem('theme', newTheme);
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);

  const themeBtn = document.getElementById('themeBtn');
  if (themeBtn) {
    const icon = themeBtn.querySelector('.theme-icon');
    const text = themeBtn.querySelector('.theme-text');
    if (theme === 'light') {
      icon.textContent = '☀️';
      text.textContent = '切换深色主题';
    } else {
      icon.textContent = '🌙';
      text.textContent = '切换浅色主题';
    }
  }

  // 更新highlight.js主题
  const hljsLink = document.querySelector('link[href*="highlight.js"]');
  if (hljsLink) {
    hljsLink.href = theme === 'light'
      ? 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css'
      : 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css';
  }

  // 更新Mermaid主题
  if (typeof mermaid !== 'undefined') {
    mermaid.initialize({
      startOnLoad: false,
      theme: theme === 'light' ? 'default' : 'dark',
      themeVariables: theme === 'light' ? {
        primaryColor: '#6366f1',
        primaryTextColor: '#1a1a1e',
        primaryBorderColor: '#4f46e5',
        lineColor: '#6b7280',
        secondaryColor: '#f3f4f6',
        tertiaryColor: '#e5e7eb'
      } : {
        primaryColor: '#6366f1',
        primaryTextColor: '#e4e4e7',
        primaryBorderColor: '#4f46e5',
        lineColor: '#a1a1aa',
        secondaryColor: '#1e1e22',
        tertiaryColor: '#27272a'
      }
    });
  }
}

async function loadHistory() {
  try {
    const response = await fetch(`${API_BASE}/api/history`);
    const history = await response.json();
    if (history.length > 0) {
      clearWelcomeMessage();
      history.forEach(msg => addMessageToUI(msg.role, msg.content, msg.files));
    }
  } catch (error) {
    console.error('加载历史记录失败:', error);
  }
}

// 发送消息
async function sendMessage() {
  const input = document.getElementById('messageInput');
  const message = input.value.trim();

  if (!message && uploadedFiles.length === 0) return;
  if (isProcessing) return;

  clearWelcomeMessage();
  addMessageToUI('user', message, uploadedFiles);

  input.value = '';
  adjustTextareaHeight(input);

  const filesToSend = [...uploadedFiles];
  uploadedFiles = [];
  updateFilePreview();

  isProcessing = true;
  updateSendButton();

  // 创建AI消息容器（带加载动画）
  const aiMessageId = createLoadingMessage();

  try {
    const response = await fetch(`${API_BASE}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, files: filesToSend })
    });

    const data = await response.json();

    if (data.success) {
      // 用打字机效果显示响应
      await typewriterEffect(aiMessageId, data.response);
    } else {
      updateMessageContent(aiMessageId, '错误: ' + (data.error || '请求失败'));
    }
  } catch (error) {
    updateMessageContent(aiMessageId, '连接错误: 无法连接到服务器');
    console.error('发送消息失败:', error);
  } finally {
    isProcessing = false;
    updateSendButton();
    focusInput();
  }
}

// 创建加载中的消息
function createLoadingMessage() {
  const container = document.getElementById('messagesContainer');
  const messageId = 'msg-' + Date.now();
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message assistant';
  messageDiv.id = messageId;

  messageDiv.innerHTML = `
    <div class="message-avatar"><span class="avatar"></span></div>
    <div class="message-content">
      <div class="message-header">
        <span class="message-role">Claude Code</span>
        <span class="message-time">${formatTime(new Date())}</span>
        <span class="streaming-indicator">⏳ 思考中...</span>
      </div>
      <div class="message-body">
        <div class="loading">
          <div class="loading-dot"></div>
          <div class="loading-dot"></div>
          <div class="loading-dot"></div>
        </div>
      </div>
    </div>
  `;

  container.appendChild(messageDiv);
  scrollToBottom();
  return messageId;
}

// 打字机效果显示响应
async function typewriterEffect(messageId, fullText) {
  const messageDiv = document.getElementById(messageId);
  if (!messageDiv) return;

  const bodyDiv = messageDiv.querySelector('.message-body');
  const indicator = messageDiv.querySelector('.streaming-indicator');

  // 移除加载动画
  if (indicator) indicator.textContent = '✍️ 输出中...';

  // 将文本分成小块逐步显示
  const chars = fullText.split('');
  let displayed = '';

  for (let i = 0; i < chars.length; i++) {
    displayed += chars[i];

    // 每隔几个字符更新一次显示（渲染markdown）
    if (i % 5 === 0 || i === chars.length - 1) {
      bodyDiv.innerHTML = marked.parse(displayed);
      scrollToBottom();
      // 短暂延迟模拟打字效果
      await sleep(20);
    }
  }

  // 确保最终内容完整渲染
  bodyDiv.innerHTML = marked.parse(fullText);

  // 渲染Mermaid图表
  await renderMermaid(bodyDiv);

  // 移除指示器
  if (indicator) indicator.remove();
}

// 更新消息内容（无动画）
async function updateMessageContent(messageId, content) {
  const messageDiv = document.getElementById(messageId);
  if (!messageDiv) return;

  const bodyDiv = messageDiv.querySelector('.message-body');
  const indicator = messageDiv.querySelector('.streaming-indicator');

  if (indicator) indicator.remove();
  bodyDiv.innerHTML = marked.parse(content);

  // 渲染Mermaid图表
  await renderMermaid(bodyDiv);
}

// 添加历史消息到UI
async function addMessageToUI(role, content, files = []) {
  const container = document.getElementById('messagesContainer');
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${role}`;

  messageDiv.innerHTML = `
    <div class="message-avatar"><span class="avatar"></span></div>
    <div class="message-content">
      <div class="message-header">
        <span class="message-role">${role === 'user' ? '念心' : 'Claude Code'}</span>
        <span class="message-time">${formatTime(new Date())}</span>
      </div>
      <div class="message-body">${role === 'user' ? escapeHtml(content || '') : marked.parse(content || '')}</div>
      ${files.length > 0 ? `<div class="message-files">${files.map(f => `<span class="file-tag">📎 ${f.originalname || f.name}</span>`).join('')}</div>` : ''}
    </div>
  `;

  container.appendChild(messageDiv);

  // 渲染Mermaid图表
  if (role !== 'user') {
    await renderMermaid(messageDiv);
  }

  scrollToBottom();
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function clearWelcomeMessage() {
  const welcome = document.querySelector('.welcome-message');
  if (welcome) welcome.remove();
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 文件上传
function triggerFileUpload() {
  document.getElementById('fileInput').click();
}

async function handleFileSelect(event) {
  const files = Array.from(event.target.files);
  if (files.length === 0) return;

  const formData = new FormData();
  files.forEach(file => formData.append('files', file));

  try {
    const preview = document.getElementById('filePreview');
    preview.style.display = 'block';
    document.getElementById('fileList').innerHTML = '<div class="file-item">⏳ 上传中...</div>';

    const response = await fetch(`${API_BASE}/api/upload`, { method: 'POST', body: formData });
    const data = await response.json();

    if (data.success && data.files) {
      data.files.forEach(file => {
        if (!uploadedFiles.some(f => f.filename === file.filename)) {
          uploadedFiles.push(file);
        }
      });
    } else {
      alert('文件上传失败: ' + (data.error || '未知错误'));
    }
    updateFilePreview();
  } catch (error) {
    console.error('文件上传失败:', error);
    alert('文件上传失败，请重试');
    updateFilePreview();
  }

  event.target.value = '';
}

function updateFilePreview() {
  const preview = document.getElementById('filePreview');
  const fileList = document.getElementById('fileList');

  if (uploadedFiles.length === 0) {
    preview.style.display = 'none';
    fileList.innerHTML = '';
    return;
  }

  preview.style.display = 'block';
  fileList.innerHTML = uploadedFiles.map((file, index) => `
    <div class="file-item">
      <span class="file-icon">${getFileIcon(file.mimetype || '')}</span>
      <span class="file-name" title="${file.originalname || file.name}">${file.originalname || file.name}</span>
      <span class="file-size">${formatFileSize(file.size)}</span>
      <button class="file-remove" onclick="removeFile(${index})">×</button>
    </div>
  `).join('');
}

function removeFile(index) {
  uploadedFiles.splice(index, 1);
  updateFilePreview();
}

function getFileIcon(type) {
  if (type.startsWith('image/')) return '🖼️';
  if (type.includes('pdf')) return '📄';
  if (type.includes('word') || type.includes('document')) return '📝';
  if (type.includes('json')) return '📋';
  if (type.includes('text')) return '📃';
  return '📁';
}

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function handleKeyDown(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
}

function adjustTextareaHeight(textarea) {
  textarea.style.height = 'auto';
  textarea.style.height = Math.min(textarea.scrollHeight, 150) + 'px';
}

function updateSendButton() {
  document.getElementById('sendBtn').disabled = isProcessing;
}

function scrollToBottom() {
  const container = document.getElementById('messagesContainer');
  container.scrollTop = container.scrollHeight;
}

function formatTime(date) {
  return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
}

function newChat() {
  if (confirm('确定要开始新对话吗？')) clearHistory();
}

async function clearHistory() {
  try {
    await fetch(`${API_BASE}/api/history`, { method: 'DELETE' });
    document.getElementById('messagesContainer').innerHTML = `
      <div class="welcome-message">
        <div class="welcome-icon">👋</div>
        <h2>欢迎使用 Claude Code Web UI</h2>
        <p>这是一个连接本地Claude Code的Web界面</p>
        <div class="welcome-tips">
          <div class="tip">
            <span></span>
            <span>输入文字与AI对话</span>
          </div>
          <div class="tip">
            <span></span>
            <span>可上传文件</span>
          </div>
          <div class="tip">
            <span></span>
            <span>支持Markdown格式</span>
          </div>
          <div class="tip">
            <span></span>
            <span>支持mermaid图表</span>
          </div>
        </div>
      </div>
    `;
  } catch (error) {
    console.error('清空历史失败:', error);
  }
}

function exportChat() {
  const messages = document.querySelectorAll('.message');
  let content = '# Claude Code 对话记录\n\n';
  content += `导出时间: ${new Date().toLocaleString('zh-CN')}\n\n`;
  messages.forEach(msg => {
    const role = msg.classList.contains('user') ? '用户' : 'Claude Code';
    const body = msg.querySelector('.message-body');
    content += `## ${role}\n${body ? body.textContent : ''}\n\n`;
  });
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `claude-chat-${new Date().toISOString().slice(0, 10)}.md`;
  a.click();
  URL.revokeObjectURL(url);
}

function toggleSidebar() {
  document.querySelector('.sidebar').classList.toggle('open');
}
