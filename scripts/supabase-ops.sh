#!/bin/bash

# Supabase操作脚本
echo "🚀 Supabase 操作脚本"
echo "=================="

case "$1" in
  "start")
    echo "启动本地Supabase..."
    supabase start
    ;;
  "stop")
    echo "停止本地Supabase..."
    supabase stop
    ;;
  "status")
    echo "检查Supabase状态..."
    supabase status
    ;;
  "db-reset")
    echo "重置数据库..."
    supabase db reset
    ;;
  "db-push")
    echo "推送数据库更改..."
    supabase db push
    ;;
  "studio")
    echo "打开Supabase Studio..."
    supabase studio
    ;;
  "help")
    echo "使用方法:"
    echo "  ./supabase-ops.sh start    - 启动本地Supabase"
    echo "  ./supabase-ops.sh stop     - 停止本地Supabase"
    echo "  ./supabase-ops.sh status   - 检查状态"
    echo "  ./supabase-ops.sh db-reset - 重置数据库"
    echo "  ./supabase-ops.sh db-push  - 推送数据库更改"
    echo "  ./supabase-ops.sh studio   - 打开Studio"
    ;;
  *)
    echo "未知命令: $1"
    echo "使用 './supabase-ops.sh help' 查看帮助"
    ;;
esac 