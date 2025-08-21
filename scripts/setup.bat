@echo off
chcp 65001 >nul

echo 🌟 启明星平台 MVP 设置脚本
echo ================================

REM 检查 Node.js 版本
echo 检查 Node.js 版本...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js 未安装，请先安装 Node.js 18+
    pause
    exit /b 1
)

for /f "tokens=1,2 delims=." %%a in ('node --version') do set NODE_VERSION=%%a
set NODE_VERSION=%NODE_VERSION:~1%
if %NODE_VERSION% lss 18 (
    echo ❌ Node.js 版本过低，需要 18+，当前版本: 
    node --version
    pause
    exit /b 1
)

echo ✅ Node.js 版本检查通过: 
node --version

REM 检查包管理器
echo 检查包管理器...
yarn --version >nul 2>&1
if %errorlevel% equ 0 (
    set PACKAGE_MANAGER=yarn
    echo ✅ 使用 Yarn 作为包管理器
) else (
    npm --version >nul 2>&1
    if %errorlevel% equ 0 (
        set PACKAGE_MANAGER=npm
        echo ✅ 使用 npm 作为包管理器
    ) else (
        echo ❌ 未找到 npm 或 yarn，请先安装
        pause
        exit /b 1
    )
)

REM 安装依赖
echo 安装项目依赖...
%PACKAGE_MANAGER% install

if %errorlevel% equ 0 (
    echo ✅ 依赖安装完成
) else (
    echo ❌ 依赖安装失败
    pause
    exit /b 1
)

REM 检查环境变量文件
echo 检查环境变量配置...
if not exist .env.local (
    echo ⚠️  未找到 .env.local 文件
    echo 📝 请复制 env.example 为 .env.local 并配置以下变量：
    echo    - NEXT_PUBLIC_SUPABASE_URL
    echo    - NEXT_PUBLIC_SUPABASE_ANON_KEY
    echo    - OPENAI_API_KEY (可选)
    echo.
    echo 运行命令：copy env.example .env.local
) else (
    echo ✅ 环境变量文件已存在
)

REM 检查 Supabase 配置
echo 检查 Supabase 配置...
if exist .env.local (
    findstr "your_supabase_url_here" .env.local >nul
    if %errorlevel% equ 0 (
        echo ⚠️  请配置 Supabase 环境变量
    ) else (
        echo ✅ Supabase 配置已设置
    )
)

echo.
echo 🎉 项目设置完成！
echo.
echo 下一步操作：
echo 1. 配置 .env.local 文件中的环境变量
echo 2. 在 Supabase 中运行 database/init.sql 脚本
echo 3. 运行 '%PACKAGE_MANAGER% run dev' 启动开发服务器
echo.
echo 📚 更多信息请查看 README.md

pause 