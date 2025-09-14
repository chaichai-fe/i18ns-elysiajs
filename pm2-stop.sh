#!/bin/bash

# PM2 停止脚本
# 使用方法: ./pm2-stop.sh

set -e

echo "🛑 停止 i18n-api 服务..."

# 停止应用
pm2 stop i18n-api

echo "✅ 服务已停止!"
echo "📊 服务状态:"
pm2 status
