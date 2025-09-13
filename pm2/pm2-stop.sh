#!/bin/bash

# PM2 停止脚本
echo "🛑 停止 I18n Translation API..."

# 停止 PM2 进程
pm2 stop i18n-api

# 删除 PM2 进程
pm2 delete i18n-api

echo "✅ 服务已停止！"
