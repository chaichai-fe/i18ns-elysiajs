#!/bin/bash

# PM2 重启脚本
# 使用方法: ./pm2-restart.sh

set -e

echo "🔄 重启 i18n-api 服务..."

# 重启应用
pm2 restart i18n-api

echo "✅ 服务重启完成!"
echo "📊 服务状态:"
pm2 status
