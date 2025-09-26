#!/bin/bash
# 构建二进制
bun run build:exe

# 上传到服务器
scp server .env username@your-server-ip:/path/to/deploy

# 通过 SSH 执行重启命令
ssh username@your-server-ip "cd /path/to/deploy && pm2 restart elysiajs-app"