# PM2 云服务器部署和监控指南

本项目已配置 PM2 进程管理器，用于生产环境部署和管理。本指南专门针对已打包项目在云服务器上的部署和监控。

## 📁 文件说明

### PM2 目录结构

```
pm2/
├── ecosystem.config.js    # PM2 配置文件
├── pm2-start.sh          # 启动脚本
├── pm2-stop.sh           # 停止脚本
├── pm2-restart.sh        # 重启脚本
└── README.md             # 本说明文档
```

### 项目根目录文件

```
项目根目录/
├── server                 # 编译后的二进制可执行文件（由 `bun run build:exe` 生成）
├── pm2/                   # PM2 配置目录
├── logs/                  # 日志目录
├── .env                   # 环境变量文件（需要手动创建）
└── package.json           # 项目配置
```

## 🚀 二进制文件优势

本项目使用 Bun 编译生成独立的二进制文件 `server`，具有以下优势：

- ✅ **无需运行时依赖**：不需要在服务器上安装 Bun 或 Node.js
- ✅ **启动更快**：直接执行二进制文件，启动速度更快
- ✅ **内存占用更少**：编译优化后的二进制文件内存占用更少
- ✅ **部署简单**：只需复制二进制文件到服务器即可运行
- ✅ **安全性更高**：源代码已编译，无法直接查看

## 🌐 云服务器部署步骤

### 1. 服务器环境准备

```bash
# 更新系统包
sudo apt update && sudo apt upgrade -y

# 安装 Node.js 和 npm（用于安装 PM2）
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 全局安装 PM2
sudo npm install -g pm2

# 验证安装
node --version
npm --version
pm2 --version
```

### 2. 项目部署

```bash
# 1. 上传项目文件到服务器（使用 scp 或 rsync）
scp -r /path/to/your/project user@your-server:/home/user/

# 2. 登录服务器
ssh user@your-server

# 3. 进入项目目录
cd /home/user/your-project

# 4. 创建环境变量文件
nano .env
```

### 3. 配置环境变量

创建 `.env` 文件并配置必要的环境变量：

```bash
# 数据库配置
DATABASE_URL="your_database_connection_string"

# JWT 密钥
JWT_SECRET="your_jwt_secret_key"

# 服务端口
PORT=3000

# 其他必要的环境变量...
```

### 4. 启动服务

```bash
# 方法一：使用启动脚本（推荐）
chmod +x pm2/pm2-start.sh
./pm2/pm2-start.sh

# 方法二：直接使用 PM2 命令
pm2 start pm2/ecosystem.config.js --env production
```

### 5. 设置开机自启

```bash
# 生成启动脚本
pm2 startup

# 保存当前进程列表
pm2 save
```

## 🚀 快速操作命令

### 使用 npm scripts（推荐）

```bash
# 构建并启动服务（生产环境）
bun run pm2:start

# 构建并启动服务（开发环境）
bun run pm2:start:dev

# 构建并启动服务（测试环境）
bun run pm2:start:staging

# 查看状态
bun run pm2:status

# 查看日志
bun run pm2:logs

# 停止服务
bun run pm2:stop

# 重启服务
bun run pm2:restart
```

### 直接使用 PM2 命令

```bash
# 启动服务
pm2 start pm2/ecosystem.config.js --env production

# 查看所有进程
pm2 list

# 查看特定进程状态
pm2 show i18n-api
```

## 📊 PM2 监控和管理命令

### 基础管理命令

```bash
# 查看所有进程状态
pm2 status
pm2 list

# 查看特定进程详细信息
pm2 show i18n-api

# 查看实时监控面板
pm2 monit

# 查看进程树
pm2 prettylist
```

### 日志管理

```bash
# 查看所有日志
pm2 logs

# 查看特定应用日志
pm2 logs i18n-api

# 查看错误日志
pm2 logs i18n-api --err

# 查看输出日志
pm2 logs i18n-api --out

# 清空日志
pm2 flush

# 实时查看日志（类似 tail -f）
pm2 logs i18n-api --lines 100
```

### 进程控制

```bash
# 启动进程
pm2 start i18n-api

# 停止进程
pm2 stop i18n-api

# 重启进程
pm2 restart i18n-api

# 重载进程（零停机重启）
pm2 reload i18n-api

# 删除进程
pm2 delete i18n-api

# 删除所有进程
pm2 delete all
```

### 进程管理

```bash
# 保存当前进程列表
pm2 save

# 恢复保存的进程列表
pm2 resurrect

# 生成启动脚本
pm2 startup

# 取消开机自启
pm2 unstartup
```

## ⚙️ 配置说明

### 环境变量

- `NODE_ENV`: 运行环境 (production/development/staging)
- `PORT`: 服务端口 (默认 3000)
- `DATABASE_URL`: 数据库连接字符串
- `JWT_SECRET`: JWT 密钥

### 日志配置

- 所有日志保存在 `logs/` 目录
- `combined.log`: 合并日志
- `out.log`: 标准输出日志
- `error.log`: 错误日志
- 日志格式: `YYYY-MM-DD HH:mm:ss Z`

### 进程管理配置

- **自动重启**: 启用
- **内存限制**: 1GB
- **最大重启次数**: 10 次
- **最小运行时间**: 10 秒
- **重启延迟**: 4000ms
- **健康检查宽限期**: 3000ms

## 🔧 生产环境优化

### 1. 日志轮转配置

创建日志轮转配置文件 `/etc/logrotate.d/pm2`：

```bash
# PM2 日志轮转配置
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
```

### 2. 系统监控脚本

创建监控脚本 `monitor.sh`：

```bash
#!/bin/bash
# 系统监控脚本

echo "=== PM2 进程状态 ==="
pm2 status

echo -e "\n=== 系统资源使用 ==="
free -h
df -h

echo -e "\n=== 最近错误日志 ==="
pm2 logs i18n-api --err --lines 10

echo -e "\n=== 服务健康检查 ==="
curl -f http://localhost:3000/health || echo "服务健康检查失败"
```

### 3. 自动备份脚本

创建备份脚本 `backup.sh`：

```bash
#!/bin/bash
# 自动备份脚本

BACKUP_DIR="/home/user/backups"
PROJECT_DIR="/home/user/your-project"
DATE=$(date +%Y%m%d_%H%M%S)

# 创建备份目录
mkdir -p $BACKUP_DIR

# 备份项目文件
tar -czf $BACKUP_DIR/project_backup_$DATE.tar.gz -C $PROJECT_DIR .

# 备份数据库（如果需要）
# mysqldump -u username -p database_name > $BACKUP_DIR/db_backup_$DATE.sql

# 清理旧备份（保留7天）
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "备份完成: $BACKUP_DIR/project_backup_$DATE.tar.gz"
```

## 🚨 故障排除

### 常见问题

1. **进程启动失败**

   ```bash
   # 查看详细错误信息
   pm2 logs i18n-api --err

   # 检查端口是否被占用
   netstat -tulpn | grep :3000
   ```

2. **内存使用过高**

   ```bash
   # 查看内存使用情况
   pm2 monit

   # 重启进程释放内存
   pm2 restart i18n-api
   ```

3. **服务无法访问**

   ```bash
   # 检查防火墙设置
   sudo ufw status

   # 检查服务是否正常运行
   curl -I http://localhost:3000
   ```

### 性能优化

1. **调整 PM2 配置**

   ```javascript
   // 在 ecosystem.config.js 中调整
   instances: 'max',  // 使用所有 CPU 核心
   exec_mode: 'cluster',  // 集群模式
   max_memory_restart: '500M',  // 降低内存限制
   ```

2. **系统优化**
   ```bash
   # 增加文件描述符限制
   echo "* soft nofile 65535" >> /etc/security/limits.conf
   echo "* hard nofile 65535" >> /etc/security/limits.conf
   ```

## 📈 监控和维护

### 日常维护任务

- ✅ 使用 `pm2 monit` 进行实时监控
- ✅ 定期检查日志文件大小和内容
- ✅ 监控内存和 CPU 使用情况
- ✅ 设置日志轮转避免磁盘空间不足
- ✅ 定期备份项目文件和数据库
- ✅ 监控服务响应时间和可用性

### 监控工具推荐

1. **PM2 Plus** (官方监控服务)
2. **New Relic** (应用性能监控)
3. **DataDog** (基础设施监控)
4. **Grafana + Prometheus** (自定义监控面板)
