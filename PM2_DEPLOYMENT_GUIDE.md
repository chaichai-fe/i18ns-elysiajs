# PM2 部署指南

本项目使用 PM2 进行生产环境部署，采用极简配置方案。

## 前置要求

- Node.js (推荐 v18+)
- PM2 (全局安装)
- 已构建的 `server` 二进制文件

## 安装 PM2

```bash
npm install -g pm2
```

## 快速部署

### 一键部署

```bash
./deploy.sh
```

这个脚本会：

1. 检查并安装 PM2（如果未安装）
2. 检查 `server` 二进制文件是否存在
3. 停止现有进程
4. 启动新进程
5. 保存 PM2 配置
6. 设置开机自启

**部署要求：**

- 已构建的 `server` 二进制文件
- 服务器已安装 PM2
- 环境变量通过系统环境或启动参数传递

### 手动部署

1. **确保 server 二进制文件存在**

   ```bash
   # 确保server文件存在且有执行权限
   chmod +x ./server
   ```

2. **启动服务**
   ```bash
   npm run pm2:start
   ```

## 服务管理

### 使用 npm 脚本

```bash
# 启动服务
npm run pm2:start

# 停止服务
npm run pm2:stop

# 重启服务
npm run pm2:restart

# 重载服务（零停机时间）
npm run pm2:reload

# 删除服务
npm run pm2:delete

# 查看日志
npm run pm2:logs

# 查看状态
npm run pm2:status

# 打开监控面板
npm run pm2:monit
```

### 使用脚本文件

```bash
# 启动
./pm2-start.sh

# 停止
./pm2-stop.sh

# 重启
./pm2-restart.sh
```

### 直接使用 PM2 命令

```bash
# 启动
pm2 start ecosystem.config.js

# 停止
pm2 stop i18n-api

# 重启
pm2 restart i18n-api

# 重载
pm2 reload i18n-api

# 删除
pm2 delete i18n-api

# 查看日志
pm2 logs i18n-api

# 查看状态
pm2 status

# 监控面板
pm2 monit
```

## 配置说明

### ecosystem.config.js

极简配置，适用于只上传二进制文件的生产环境：

- **name**: 应用名称
- **script**: 启动脚本路径（指向 server 二进制文件）
- **instances**: 实例数量（'max' 表示使用所有 CPU 核心）
- **exec_mode**: 执行模式（'cluster' 表示集群模式）
- **env**: 环境变量
- **autorestart**: 自动重启
- **max_memory_restart**: 内存限制重启
- **min_uptime**: 最小运行时间
- **max_restarts**: 最大重启次数

**配置特点：**

- 极简配置，只保留核心功能
- 无需复杂的日志配置
- 无需文件监听功能
- 无需环境变量文件依赖
- 专注于进程管理

## 监控和性能

### 查看服务状态

```bash
pm2 status
```

### 监控面板

```bash
pm2 monit
```

### 查看详细信息

```bash
pm2 show i18n-api
```

## 故障排除

### 查看错误日志

```bash
pm2 logs i18n-api --err
```

### 重启服务

```bash
pm2 restart i18n-api
```

### 完全重新部署

```bash
pm2 delete i18n-api
./deploy.sh
```

## 开机自启

PM2 会在部署时自动设置开机自启，如果需要手动设置：

```bash
pm2 startup
pm2 save
```

## 环境变量

环境变量通过系统环境或启动参数传递，无需 `.env` 文件：

```bash
# 通过环境变量启动
NODE_ENV=production PORT=3000 pm2 start ecosystem.config.js

# 或在ecosystem.config.js中配置
env: {
  NODE_ENV: 'production',
  PORT: 3000,
  DATABASE_URL: 'your_database_url',
  JWT_SECRET: 'your_jwt_secret'
}
```

## 服务访问

- 应用地址: http://localhost:3000
- 健康检查: http://localhost:3000/health
- API 文档: http://localhost:3000/swagger

## 注意事项

1. 确保服务器有足够的内存和 CPU 资源
2. 监控服务状态，确保服务正常运行
3. 在生产环境中建议关闭文件监听功能
4. 定期更新依赖包以保持安全性
5. 确保 `server` 二进制文件有执行权限
