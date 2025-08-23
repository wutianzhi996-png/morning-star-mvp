# Vercel 部署指南

## 📋 部署前准备

### 1. 确保代码已推送到Git仓库
```bash
# 如果还没有初始化git
git init
git add .
git commit -m "Ready for Vercel deployment"

# 推送到GitHub/GitLab/Bitbucket
git remote add origin your-git-repo-url
git push -u origin main
```

### 2. 创建Supabase项目（如果还没有）
1. 访问 [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. 创建新项目，记住项目URL和API密钥
3. 在SQL Editor中执行 `database/init.sql` 创建表结构

## 🚀 Vercel部署步骤

### 方式一：通过Vercel Dashboard部署

1. **登录Vercel**
   - 访问 [https://vercel.com](https://vercel.com)
   - 使用GitHub/GitLab/Bitbucket账户登录

2. **导入项目**
   - 点击 "New Project"
   - 选择你的Git仓库
   - 点击 "Import"

3. **配置项目设置**
   - **Project Name**: `morning-star-mvp`（或自定义名称）
   - **Framework Preset**: Next.js（自动检测）
   - **Root Directory**: `./` （默认）

4. **配置环境变量**
   在 "Environment Variables" 部分添加：
   ```
   NEXT_PUBLIC_SUPABASE_URL = https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = your-supabase-anon-key
   OPENAI_API_KEY = your-openai-key（可选）
   NODE_ENV = production
   ```

5. **部署**
   - 点击 "Deploy"
   - 等待构建完成（通常2-3分钟）

### 方式二：通过Vercel CLI部署

1. **安装Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **登录Vercel**
   ```bash
   vercel login
   ```

3. **部署**
   ```bash
   # 首次部署
   vercel

   # 生产环境部署
   vercel --prod
   ```

4. **设置环境变量**
   ```bash
   vercel env add NEXT_PUBLIC_SUPABASE_URL
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
   vercel env add OPENAI_API_KEY
   ```

## ⚙️ 部署后配置

### 1. 域名设置（可选）
- 在Vercel Dashboard的项目设置中
- 添加自定义域名
- 配置DNS记录

### 2. 性能优化
项目已包含以下优化：
- ✅ 图片自动优化（WebP/AVIF）
- ✅ 自动压缩
- ✅ SWC编译器
- ✅ 安全头部设置
- ✅ 缓存优化

### 3. 监控设置
- 在Vercel Dashboard查看：
  - 访问分析
  - 性能监控  
  - 错误日志
  - 函数调用统计

## 🔍 部署后检查清单

### ✅ 功能测试
1. **首页访问**: 确认页面正常加载
2. **用户注册**: 测试注册新账户
3. **用户登录**: 测试现有账户登录
4. **OKR功能**: 创建和编辑学习目标
5. **AI聊天**: 测试智能助手对话
6. **数据持久化**: 确认数据正确保存到Supabase

### ✅ 性能检查
- 使用 [PageSpeed Insights](https://pagespeed.web.dev/) 测试性能
- 检查移动端体验
- 验证加载时间 < 3秒

### ✅ 安全检查
- HTTPS自动启用
- 安全头部已设置
- 环境变量未泄露

## 🐛 常见问题解决

### Q: 构建失败 "Module not found"
```bash
# 清理依赖重新安装
rm -rf node_modules package-lock.json
npm install
```

### Q: 环境变量未生效
- 确保变量名以 `NEXT_PUBLIC_` 开头（客户端变量）
- 检查Vercel Dashboard中的环境变量设置
- 重新部署项目

### Q: Supabase连接失败  
- 验证URL和API Key的正确性
- 检查Supabase项目是否暂停
- 确认RLS策略设置正确

### Q: 页面404错误
- 检查路由配置
- 确认所有页面组件正确导出
- 查看Vercel Function日志

## 📊 监控和维护

### 1. 设置告警
- 在Vercel Dashboard配置错误告警
- 监控函数执行时间和失败率

### 2. 定期更新
- 定期更新依赖包
- 监控安全漏洞
- 备份Supabase数据

### 3. 性能优化
- 定期检查Core Web Vitals
- 优化图片和资源加载
- 监控数据库查询性能

## 🎉 部署完成！

部署成功后，你将获得：
- 🌐 **生产环境URL**: `https://your-project.vercel.app`
- 📊 **实时监控**: Vercel Dashboard Analytics  
- 🔒 **自动HTTPS**: SSL证书自动配置
- 🚀 **全球CDN**: 边缘网络加速
- 📱 **移动优化**: 响应式设计完美呈现

现在你的启明星学习平台已经在云端运行，可以为全球用户提供服务了！