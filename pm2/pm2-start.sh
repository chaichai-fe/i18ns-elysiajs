#!/bin/bash

# PM2 启动脚本
echo "🚀 启动 I18n Translation API..."

# 检查是否安装了 PM2
if ! command -v pm2 &> /dev/null; then
    echo "❌ PM2 未安装，正在安装..."
    npm install -g pm2
fi

# 构建项目（生成二进制文件）
echo "📦 构建项目（生成二进制文件）..."
bun run build:exe

# 启动 PM2 进程
echo "🔄 启动 PM2 进程..."
pm2 start pm2/ecosystem.config.js --env production

# 显示状态
pm2 status

echo "✅ 服务已启动！"
echo "📊 使用 'pm2 monit' 查看实时监控"
echo "📝 使用 'pm2 logs' 查看日志"
