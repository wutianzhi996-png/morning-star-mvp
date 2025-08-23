# Supabase 配置指南

## 📋 快速配置步骤

### 1. 创建 Supabase 项目
1. 访问 [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. 点击 "New Project" 创建新项目
3. 选择组织，输入项目名称（如：morning-star-mvp）
4. 选择数据库密码并记住它
5. 选择地区（推荐 Singapore 新加坡，延迟较低）
6. 点击 "Create new project"

### 2. 获取项目配置信息
项目创建完成后：
1. 在项目首页，点击左侧菜单 "Settings" → "API"
2. 复制以下信息：
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **Project API keys** 中的 **anon/public** key

### 3. 配置环境变量
在项目根目录的 `.env.local` 文件中，替换以下内容：

```env
# 将 your-project-ref 替换为你的实际项目引用
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co

# 将下面的密钥替换为你的实际 anon key
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-actual-anon-key
```

### 4. 设置数据库表结构
1. 在 Supabase Dashboard 中，点击左侧菜单 "SQL Editor"
2. 点击 "New query"
3. 复制并执行 `database/init.sql` 文件中的SQL代码

### 5. 启用 Row Level Security (RLS)
数据库表创建完成后，确保为每个表启用了行级安全策略：

```sql
-- 为 okrs 表启用 RLS
ALTER TABLE okrs ENABLE ROW LEVEL SECURITY;

-- 创建 okrs 表的访问策略
CREATE POLICY "Users can view their own OKRs" ON okrs
    FOR ALL USING (auth.uid() = user_id);

-- 为 chat_history 表启用 RLS
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;

-- 创建 chat_history 表的访问策略  
CREATE POLICY "Users can view their own chat history" ON chat_history
    FOR ALL USING (auth.uid() = user_id);
```

### 6. 测试连接
配置完成后：
1. 重启开发服务器：`npm run dev`
2. 访问 http://localhost:3002
3. 尝试注册新账户
4. 如果注册成功并能跳转到 dashboard，说明配置正确

## 🔧 常见问题

### Q: 找不到 Project URL 或 API Key？
A: 在 Supabase Dashboard → Settings → API 页面查找

### Q: 数据库表创建失败？
A: 检查 SQL 语法，确保在 SQL Editor 中正确执行了 `database/init.sql` 的内容

### Q: 用户注册后无法登录？
A: 检查邮箱确认设置。在 Authentication → Settings → Auth Settings 中可以关闭邮箱确认要求

### Q: RLS 策略导致数据访问被拒绝？
A: 确保为每个表正确设置了 RLS 策略，允许用户访问自己的数据

## 📞 需要帮助？
如果遇到问题，可以：
1. 查看浏览器控制台的错误信息
2. 检查 Supabase Dashboard 的日志
3. 确认 `.env.local` 文件中的配置正确