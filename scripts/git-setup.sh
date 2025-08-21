#!/bin/bash

echo "🌟 启明星平台 MVP - Git 初始化脚本"
echo "======================================"

# 检查 Git 是否安装
if ! command -v git &> /dev/null; then
    echo "❌ Git 未安装，请先安装 Git"
    exit 1
fi

echo "✅ Git 已安装: $(git --version)"

# 检查是否已经在 Git 仓库中
if [ -d ".git" ]; then
    echo "⚠️  当前目录已经是 Git 仓库"
    read -p "是否要重新初始化？(y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "操作已取消"
        exit 0
    fi
    echo "删除现有 .git 目录..."
    rm -rf .git
fi

# 初始化 Git 仓库
echo "初始化 Git 仓库..."
git init

# 配置用户信息
echo "配置 Git 用户信息..."
echo "请确保你已经配置了 Git 用户信息，如果没有，请运行："
echo "git config --global user.name '你的名字'"
echo "git config --global user.email 'wutianzhi996@gmail.com'"
echo ""

# 添加所有文件
echo "添加文件到暂存区..."
git add .

# 创建首次提交
echo "创建首次提交..."
git commit -m "🎉 初始提交：启明星平台 MVP

- 基于OKR的AI智能学习助手平台
- 用户认证系统（Supabase）
- OKR管理功能
- AI聊天助手
- 聊天历史记录
- 响应式UI设计（Tailwind CSS）
- Next.js 14 + TypeScript架构"

# 添加远程仓库
echo "添加远程仓库..."
git remote add origin https://github.com/wutianzhi996-png/morning-star-mvp.git

# 设置主分支名称
echo "设置主分支名称..."
git branch -M main

echo ""
echo "🎉 Git 仓库初始化完成！"
echo ""
echo "下一步操作："
echo "1. 在 GitHub 上创建名为 'morning-star-mvp' 的公开仓库"
echo "2. 仓库描述：基于OKR的AI智能学习助手平台，为学生提供个性化学习指导和任务管理"
echo "3. 运行以下命令推送代码："
echo "   git push -u origin main"
echo ""
echo "⚠️  注意："
echo "- 确保 GitHub 仓库已创建"
echo "- 确保你有推送权限"
echo "- 如果使用 SSH，请将远程仓库URL改为："
echo "  git remote set-url origin git@github.com:wutianzhi996-png/morning-star-mvp.git"
echo ""
echo "�� 更多信息请查看 README.md" 