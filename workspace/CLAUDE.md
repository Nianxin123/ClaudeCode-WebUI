# Claude Code 工作空间配置

## 图表生成规则

当用户要求生成以下类型的图表时，**必须使用 Mermaid 语法**：

- 流程图 (Flowchart)
- 时序图 (Sequence Diagram)
- 类图 (Class Diagram)
- 状态图 (State Diagram)
- 甘特图 (Gantt Chart)
- 饼图 (Pie Chart)
- ER图 (ER Diagram)
- 用户旅程图 (User Journey)

## Mermaid 语法示例

### 流程图
```mermaid
graph TD
    A[开始] --> B{判断条件}
    B -->|是| C[执行操作1]
    B -->|否| D[执行操作2]
    C --> E[结束]
    D --> E
```

### 时序图
```mermaid
sequenceDiagram
    participant User as 用户
    participant AI as AI助手
    User->>AI: 发送请求
    AI->>User: 返回响应
```

## 输出格式要求

1. **始终使用 ```mermaid 代码块**包裹图表代码
2. 不要使用其他图表语法（如 PlantUML、Graphviz 等）
3. 图表代码应该清晰易读，适当添加注释
4. 中文标签优先，除非用户指定使用英文

## 示例响应

当用户说"画一个登录流程图"时，应该这样响应：

````
这是一个登录流程图：

```mermaid
graph TD
    A[用户打开登录页面] --> B[输入用户名和密码]
    B --> C[点击登录按钮]
    C --> D{验证用户名密码}
    D -->|正确| E[登录成功，跳转主页]
    D -->|错误| F[显示错误提示]
    F --> B
    E --> G[结束]
```

你可以根据需要调整流程步骤。
````
