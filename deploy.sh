#!/bin/bash

# 构建二进制
echo "开始构建二进制文件..."
bun run build:exe

# 创建部署目录（如果不存在）
echo "准备部署文件..."
ssh username@your-server-ip "mkdir -p /path/to/deploy/logs"

# 上传文件到服务器
echo "上传文件到服务器..."
scp server .env ecosystem.config.js username@your-server-ip:/path/to/deploy

# 通过 SSH 执行部署命令
echo "开始部署应用..."
ssh username@your-server-ip "cd /path/to/deploy && \
  # 如果应用已经在运行，先删除旧的实例
  pm2 delete i18n-api 2>/dev/null || true && \
  # 使用配置文件启动应用
  pm2 start ecosystem.config.js --env production && \
  # 保存 PM2 进程列表
  pm2 save && \
  # 显示应用状态
  pm2 status"

echo "部署完成！"