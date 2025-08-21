# 📁 启明星平台 MVP 项目结构

```
morning-star-mvp/
├── 📁 app/                          # Next.js App Router 目录
│   ├── 📁 dashboard/                # 仪表板页面
│   │   └── page.tsx                # 主应用界面
│   ├── globals.css                  # 全局样式文件
│   ├── layout.tsx                   # 根布局组件
│   └── page.tsx                     # 首页（登录/注册）
│
├── 📁 components/                    # React 组件目录
│   ├── OKRForm.tsx                  # OKR 创建/编辑表单
│   ├── ChatInterface.tsx            # AI 聊天界面
│   └── ChatHistory.tsx              # 聊天历史记录
│
├── 📁 lib/                          # 工具库目录
│   └── supabase.ts                  # Supabase 客户端配置
│
├── 📁 database/                     # 数据库相关文件
│   └── init.sql                     # 数据库初始化脚本
│
├── 📁 scripts/                      # 项目设置脚本
│   ├── setup.sh                     # Linux/Mac 设置脚本
│   └── setup.bat                    # Windows 设置脚本
│
├── 📁 public/                       # 静态资源目录
│
├── package.json                     # 项目依赖配置
├── next.config.js                   # Next.js 配置
├── tailwind.config.js               # Tailwind CSS 配置
├── postcss.config.js                # PostCSS 配置
├── tsconfig.json                    # TypeScript 配置
├── env.example                      # 环境变量示例
├── README.md                        # 项目说明文档
└── PROJECT_STRUCTURE.md             # 项目结构说明（本文件）
```

## 🔧 核心文件说明

### 应用页面
- **`app/page.tsx`**: 首页，包含用户认证界面
- **`app/dashboard/page.tsx`**: 主应用界面，整合所有功能

### 核心组件
- **`OKRForm.tsx`**: OKR 管理组件，支持创建和编辑
- **`ChatInterface.tsx`**: AI 聊天核心组件，处理用户输入和AI响应
- **`ChatHistory.tsx`**: 聊天记录管理，按会话分组显示

### 配置文件
- **`lib/supabase.ts`**: Supabase 客户端配置和类型定义
- **`database/init.sql`**: 完整的数据库初始化脚本
- **`env.example`**: 环境变量配置模板

### 设置脚本
- **`scripts/setup.sh`**: Unix/Linux/Mac 环境设置脚本
- **`scripts/setup.bat`**: Windows 环境设置脚本

## 🚀 快速启动流程

1. **环境准备**
   ```bash
   # 克隆项目
   git clone <repo-url>
   cd morning-star-mvp
   
   # 运行设置脚本
   ./scripts/setup.sh          # Linux/Mac
   # 或
   scripts\setup.bat           # Windows
   ```

2. **配置环境变量**
   ```bash
   cp env.example .env.local
   # 编辑 .env.local 文件，配置 Supabase 信息
   ```

3. **初始化数据库**
   - 在 Supabase 中运行 `database/init.sql` 脚本

4. **启动开发服务器**
   ```bash
   npm run dev
   # 或
   yarn dev
   ```

## 🔄 数据流

```
用户操作 → 前端组件 → Supabase API → 数据库
    ↓
AI 响应 ← 聊天记录 ← 数据存储 ← 用户输入
```

## 🎯 功能模块

### 用户认证模块
- 邮箱注册/登录
- 会话管理
- 权限控制

### OKR 管理模块
- 目标创建/编辑
- 关键结果管理
- 数据持久化

### AI 聊天模块
- 智能问答
- 任务推荐
- 对话记录

### 数据存储模块
- 用户数据隔离
- 聊天历史管理
- 知识库支持

## 🔒 安全特性

- 行级安全策略 (RLS)
- 用户数据隔离
- 认证状态验证
- 输入验证和清理

## 📱 响应式设计

- 移动端友好
- 桌面端优化
- 自适应布局
- 触摸友好交互

---

**项目结构设计遵循 Next.js 13+ App Router 最佳实践，确保代码组织清晰、易于维护和扩展。** 