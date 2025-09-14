#!/bin/bash

# i18n-api 简化部署脚本
# 仅适用于已打包的server二进制文件

set -e

echo "🚀 开始简化部署 i18n-api 服务..."

# 检查PM2是否已安装
if ! command -v pm2 &> /dev/null; then
    echo "❌ PM2 未安装，正在安装..."
    npm install -g pm2
fi

# 检查server二进制文件是否存在
if [ ! -f "./server" ]; then
    echo "❌ server 二进制文件不存在，请确保已上传server文件"
    exit 1
fi

# 确保server文件有执行权限
chmod +x ./server

# 停止现有进程（如果存在）
echo "🛑 停止现有进程..."
pm2 stop i18n-api 2>/dev/null || true
pm2 delete i18n-api 2>/dev/null || true

# 启动应用
echo "▶️ 启动应用..."
pm2 start ecosystem.config.js

# 保存PM2配置
echo "💾 保存PM2配置..."
pm2 save

# 设置PM2开机自启
echo "🔄 设置开机自启..."
pm2 startup

echo "✅ 简化部署完成!"
echo ""
echo "📊 服务状态:"
pm2 status

echo ""
echo "📋 常用命令:"
echo "  查看日志: pm2 logs i18n-api"
echo "  重启服务: pm2 restart i18n-api"
echo "  停止服务: pm2 stop i18n-api"
echo "  查看状态: pm2 status"
echo ""
echo "🌐 服务地址: http://localhost:3000"
