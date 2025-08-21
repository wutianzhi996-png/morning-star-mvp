#!/bin/bash

echo "🌟 启明星平台 MVP 设置脚本"
echo "================================"

# 检查 Node.js 版本
echo "检查 Node.js 版本..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js 18+"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 版本过低，需要 18+，当前版本: $(node -v)"
    exit 1
fi

echo "✅ Node.js 版本检查通过: $(node -v)"

# 检查 npm 或 yarn
echo "检查包管理器..."
if command -v yarn &> /dev/null; then
    PACKAGE_MANAGER="yarn"
    echo "✅ 使用 Yarn 作为包管理器"
elif command -v npm &> /dev/null; then
    PACKAGE_MANAGER="npm"
    echo "✅ 使用 npm 作为包管理器"
else
    echo "❌ 未找到 npm 或 yarn，请先安装"
    exit 1
fi

# 安装依赖
echo "安装项目依赖..."
$PACKAGE_MANAGER install

if [ $? -eq 0 ]; then
    echo "✅ 依赖安装完成"
else
    echo "❌ 依赖安装失败"
    exit 1
fi

# 检查环境变量文件
echo "检查环境变量配置..."
if [ ! -f .env.local ]; then
    echo "⚠️  未找到 .env.local 文件"
    echo "📝 请复制 env.example 为 .env.local 并配置以下变量："
    echo "   - NEXT_PUBLIC_SUPABASE_URL"
    echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
    echo "   - OPENAI_API_KEY (可选)"
    echo ""
    echo "运行命令：cp env.example .env.local"
else
    echo "✅ 环境变量文件已存在"
fi

# 检查 Supabase 配置
echo "检查 Supabase 配置..."
if [ -f .env.local ]; then
    if grep -q "your_supabase_url_here" .env.local; then
        echo "⚠️  请配置 Supabase 环境变量"
    else
        echo "✅ Supabase 配置已设置"
    fi
fi

echo ""
echo "🎉 项目设置完成！"
echo ""
echo "下一步操作："
echo "1. 配置 .env.local 文件中的环境变量"
echo "2. 在 Supabase 中运行 database/init.sql 脚本"
echo "3. 运行 '$PACKAGE_MANAGER run dev' 启动开发服务器"
echo ""
echo "�� 更多信息请查看 README.md" 