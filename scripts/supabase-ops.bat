@echo off
REM Supabase操作脚本 (Windows版本)
echo 🚀 Supabase 操作脚本
echo ==================

if "%1"=="start" (
    echo 启动本地Supabase...
    supabase start
) else if "%1"=="stop" (
    echo 停止本地Supabase...
    supabase stop
) else if "%1"=="status" (
    echo 检查Supabase状态...
    supabase status
) else if "%1"=="db-reset" (
    echo 重置数据库...
    supabase db reset
) else if "%1"=="db-push" (
    echo 推送数据库更改...
    supabase db push
) else if "%1"=="studio" (
    echo 打开Supabase Studio...
    supabase studio
) else if "%1"=="help" (
    echo 使用方法:
    echo   supabase-ops.bat start    - 启动本地Supabase
    echo   supabase-ops.bat stop     - 停止本地Supabase
    echo   supabase-ops.bat status   - 检查状态
    echo   supabase-ops.bat db-reset - 重置数据库
    echo   supabase-ops.bat db-push  - 推送数据库更改
    echo   supabase-ops.bat studio   - 打开Studio
) else (
    echo 未知命令: %1
    echo 使用 'supabase-ops.bat help' 查看帮助
) 