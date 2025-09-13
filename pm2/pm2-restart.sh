#!/bin/bash

# PM2 重启脚本
echo "🔄 重启 I18n Translation API..."

# 重新构建项目（生成二进制文件）
echo "📦 重新构建项目（生成二进制文件）..."
bun run build:exe

# 重启 PM2 进程
pm2 restart i18n-api

# 显示状态
pm2 status

echo "✅ 服务已重启！"
