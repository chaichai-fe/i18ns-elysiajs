#!/bin/bash

# PM2 云服务器部署脚本
# 使用方法: ./pm2/deploy.sh [environment]
# 环境选项: production, staging, development

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查参数
ENVIRONMENT=${1:-production}

log_info "开始部署 I18n Translation API (环境: $ENVIRONMENT)"

# 检查 PM2 是否安装
if ! command -v pm2 &> /dev/null; then
    log_error "PM2 未安装，正在安装..."
    npm install -g pm2
    if [ $? -ne 0 ]; then
        log_error "PM2 安装失败"
        exit 1
    fi
    log_success "PM2 安装完成"
fi

# 检查项目文件
if [ ! -f "server" ]; then
    log_warning "二进制文件不存在，正在构建..."
    if command -v bun &> /dev/null; then
        bun run build:exe
    else
        log_error "Bun 未安装，无法构建项目"
        exit 1
    fi
fi

# 创建日志目录
mkdir -p logs

# 检查环境变量文件
if [ ! -f ".env" ]; then
    log_warning ".env 文件不存在，创建示例文件..."
    cat > .env << EOF
# 数据库配置
DATABASE_URL="your_database_connection_string"

# JWT 密钥
JWT_SECRET="your_jwt_secret_key"

# 服务端口
PORT=3000

# 运行环境
NODE_ENV=$ENVIRONMENT
EOF
    log_warning "请编辑 .env 文件并配置正确的环境变量"
fi

# 停止现有进程
log_info "停止现有进程..."
pm2 stop i18n-api 2>/dev/null || true
pm2 delete i18n-api 2>/dev/null || true

# 启动服务
log_info "启动服务..."
pm2 start pm2/ecosystem.production.js --env $ENVIRONMENT

# 等待服务启动
sleep 3

# 检查服务状态
if pm2 list | grep -q "i18n-api.*online"; then
    log_success "服务启动成功！"
    
    # 显示服务信息
    echo ""
    log_info "服务状态："
    pm2 status
    
    echo ""
    log_info "服务信息："
    echo "  应用名称: i18n-api"
    echo "  运行环境: $ENVIRONMENT"
    echo "  服务端口: 3000"
    echo "  日志目录: ./logs/"
    
    echo ""
    log_info "常用命令："
    echo "  查看状态: pm2 status"
    echo "  查看日志: pm2 logs i18n-api"
    echo "  实时监控: pm2 monit"
    echo "  重启服务: pm2 restart i18n-api"
    echo "  停止服务: pm2 stop i18n-api"
    
    # 健康检查
    log_info "执行健康检查..."
    if curl -f http://localhost:3000/health >/dev/null 2>&1; then
        log_success "健康检查通过"
    else
        log_warning "健康检查失败，请检查服务日志"
    fi
    
else
    log_error "服务启动失败"
    log_info "查看错误日志："
    pm2 logs i18n-api --err --lines 20
    exit 1
fi

# 设置开机自启
log_info "设置开机自启..."
pm2 startup >/dev/null 2>&1 || true
pm2 save

log_success "部署完成！"
