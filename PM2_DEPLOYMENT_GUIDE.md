# PM2 云服务器快速部署指南

## 🚀 一键部署脚本

### 1. 服务器环境准备

```bash
# 更新系统并安装必要工具
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git

# 安装 Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 全局安装 PM2
sudo npm install -g pm2

# 验证安装
node --version && npm --version && pm2 --version
```

### 2. 项目部署

```bash
# 上传项目到服务器（替换为你的服务器信息）
scp -r /path/to/your/project user@your-server-ip:/home/user/

# 登录服务器
ssh user@your-server-ip

# 进入项目目录
cd /home/user/your-project

# 创建环境变量文件
cat > .env << EOF
DATABASE_URL="your_database_connection_string"
JWT_SECRET="your_jwt_secret_key"
PORT=3000
NODE_ENV=production
EOF

# 设置脚本执行权限
chmod +x pm2/*.sh

# 启动服务
./pm2/pm2-start.sh

# 设置开机自启
pm2 startup
pm2 save
```

## 📋 常用操作命令

### 服务管理

```bash
# 查看服务状态
pm2 status

# 查看实时监控
pm2 monit

# 查看日志
pm2 logs i18n-api

# 重启服务
pm2 restart i18n-api

# 停止服务
pm2 stop i18n-api

# 删除服务
pm2 delete i18n-api
```

### 日志管理

```bash
# 查看所有日志
pm2 logs

# 查看错误日志
pm2 logs i18n-api --err

# 清空日志
pm2 flush

# 实时查看日志
pm2 logs i18n-api --lines 50
```

## 🔧 生产环境优化

### 1. 防火墙配置

```bash
# 开放服务端口
sudo ufw allow 3000
sudo ufw enable

# 检查防火墙状态
sudo ufw status
```

### 2. 日志轮转

```bash
# 创建日志轮转配置
sudo tee /etc/logrotate.d/pm2 > /dev/null << EOF
/home/user/your-project/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 user user
    postrotate
        pm2 reloadLogs
    endscript
}
EOF
```

### 3. 系统监控

```bash
# 创建监控脚本
cat > monitor.sh << 'EOF'
#!/bin/bash
echo "=== PM2 进程状态 ==="
pm2 status

echo -e "\n=== 系统资源 ==="
free -h
df -h

echo -e "\n=== 服务健康检查 ==="
curl -f http://localhost:3000/health || echo "服务不可用"
EOF

chmod +x monitor.sh
```

## 🚨 故障排除

### 常见问题解决

1. **服务启动失败**

   ```bash
   # 查看错误日志
   pm2 logs i18n-api --err

   # 检查端口占用
   sudo netstat -tulpn | grep :3000
   ```

2. **内存使用过高**

   ```bash
   # 查看资源使用
   pm2 monit

   # 重启服务
   pm2 restart i18n-api
   ```

3. **服务无法访问**

   ```bash
   # 检查服务状态
   pm2 status

   # 检查防火墙
   sudo ufw status

   # 测试本地连接
   curl http://localhost:3000
   ```

## 📊 监控和维护

### 日常检查清单

- [ ] 检查服务状态：`pm2 status`
- [ ] 查看错误日志：`pm2 logs i18n-api --err`
- [ ] 监控资源使用：`pm2 monit`
- [ ] 检查磁盘空间：`df -h`
- [ ] 测试服务可用性：`curl http://localhost:3000`

### 定期维护任务

- [ ] 清理旧日志文件
- [ ] 更新系统包
- [ ] 备份项目文件
- [ ] 检查安全更新
- [ ] 监控性能指标

## 🔄 更新部署

```bash
# 停止服务
pm2 stop i18n-api

# 更新代码（从 Git 拉取或上传新文件）
git pull origin main

# 重新构建
bun run build:exe

# 启动服务
pm2 start i18n-api

# 检查状态
pm2 status
```

## 📞 技术支持

如果遇到问题，请检查：

1. **日志文件**：`pm2 logs i18n-api`
2. **系统资源**：`pm2 monit`
3. **网络连接**：`curl http://localhost:3000`
4. **配置文件**：检查 `.env` 文件是否正确

---

**注意**：请根据实际服务器环境调整路径和配置参数。
