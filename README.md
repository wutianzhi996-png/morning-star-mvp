# 🌟 启明星平台 MVP

基于OKR的AI智能学习助手平台，为学生提供个性化学习指导和任务管理。

## 🚀 功能特性

### 核心功能
- **用户认证**: 邮箱注册/登录系统
- **OKR管理**: 创建和编辑学习目标与关键结果
- **AI聊天助手**: 智能问答和基于OKR的任务推荐
- **聊天历史**: 完整的对话记录保存和查看
- **响应式设计**: 支持桌面和移动设备

### AI助手能力
- 基于用户OKR生成每日任务推荐
- 数据结构等专业知识问答
- 个性化学习建议和指导

## 🛠️ 技术栈

- **前端**: Next.js 14 + React 18 + TypeScript
- **样式**: Tailwind CSS
- **后端**: Supabase (Auth, Database, pgvector)
- **图标**: Lucide React
- **部署**: Vercel (推荐)

## 📋 系统要求

- Node.js 18+ 
- npm 或 yarn
- Supabase 账户
- OpenAI API 密钥 (可选，用于真实AI功能)

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/wutianzhi996-png/morning-star-mvp.git
cd morning-star-mvp
```

### 2. 安装依赖

```bash
npm install
# 或
yarn install
```

### 3. 环境配置

复制环境变量示例文件：

```bash
cp env.example .env.local
```

编辑 `.env.local` 文件，填入你的配置：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
OPENAI_API_KEY=your_openai_api_key_here
```

### 4. 设置 Supabase

#### 4.1 创建 Supabase 项目
1. 访问 [supabase.com](https://supabase.com)
2. 创建新项目
3. 获取项目URL和匿名密钥

#### 4.2 创建数据库表
在 Supabase SQL Editor 中运行以下SQL：

```sql
-- 启用 pgvector 扩展
CREATE EXTENSION IF NOT EXISTS vector;

-- OKR表
CREATE TABLE public.okrs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    objective TEXT NOT NULL,
    key_results JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 聊天记录表
CREATE TABLE public.chat_history (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id UUID DEFAULT gen_random_uuid(),
    message JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 知识库向量表
CREATE TABLE public.knowledge_chunks (
    id BIGSERIAL PRIMARY KEY,
    content TEXT,
    embedding VECTOR(1536)
);

-- 启用行级安全策略
ALTER TABLE public.okrs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;

-- 创建策略
CREATE POLICY "用户只能操作自己的OKR" ON public.okrs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "用户只能操作自己的聊天记录" ON public.chat_history FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "对所有认证用户开放读取权限" ON public.knowledge_chunks FOR SELECT USING (auth.role() = 'authenticated');
```

### 5. 运行开发服务器

```bash
npm run dev
# 或
yarn dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 📱 页面结构

### 主要页面
- **首页** (`/`): 登录/注册界面
- **仪表板** (`/dashboard`): 主应用界面

### 组件结构
- `OKRForm`: OKR创建和编辑表单
- `ChatInterface`: AI聊天界面
- `ChatHistory`: 聊天历史记录

## 🔧 开发说明

### 项目结构
```
morning-star-mvp/
├── app/                    # Next.js App Router
│   ├── dashboard/         # 仪表板页面
│   ├── globals.css       # 全局样式
│   ├── layout.tsx        # 根布局
│   └── page.tsx          # 首页
├── components/            # React组件
│   ├── OKRForm.tsx       # OKR表单
│   ├── ChatInterface.tsx # 聊天界面
│   └── ChatHistory.tsx   # 聊天历史
├── lib/                   # 工具库
│   └── supabase.ts       # Supabase配置
├── public/                # 静态资源
└── package.json           # 项目配置
```

### 核心功能实现

#### OKR管理
- 支持创建1个目标和2-3个关键结果
- 数据存储在Supabase的`okrs`表中
- 支持编辑和更新

#### AI聊天
- 模拟AI响应（可替换为真实OpenAI API）
- 基于OKR的任务推荐
- 专业知识问答
- 聊天记录自动保存

#### 用户认证
- 基于Supabase Auth的邮箱认证
- 自动用户会话管理
- 行级数据安全

## 🚀 部署

### Vercel部署（推荐）

1. 将代码推送到GitHub
2. 在Vercel中导入项目
3. 配置环境变量
4. 自动部署

### 其他平台

项目基于Next.js构建，支持部署到任何支持Node.js的平台。

## 🔮 未来扩展

### 短期目标
- 集成真实OpenAI API
- 添加更多知识库内容
- 实现OKR进度追踪

### 长期愿景
- 多模态AI交互
- 智能生涯规划
- 自适应学习内容
- 教育元宇宙探索

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📄 许可证

MIT License

## 📞 支持

如有问题，请创建Issue或联系开发团队。

---

**启明星平台** - 让每个学生都成为自己的成长CEO 🌟 