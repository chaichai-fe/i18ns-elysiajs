#!/bin/bash

# PM2 启动脚本
# 使用方法: ./pm2-start.sh

set -e

echo "🚀 启动 i18n-api 服务..."

# 检查PM2是否已安装
if ! command -v pm2 &> /dev/null; then
    echo "❌ PM2 未安装，正在安装..."
    npm install -g pm2
fi

# 检查server二进制文件是否存在
if [ ! -f "./server" ]; then
    echo "❌ server 二进制文件不存在，请确保已构建项目"
    exit 1
fi

# 确保server文件有执行权限
chmod +x ./server

# 启动应用
pm2 start ecosystem.config.js

echo "✅ 服务启动完成!"
echo "📊 服务状态:"
pm2 status
