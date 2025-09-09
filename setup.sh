#!/bin/bash

echo "🦊 Setting up ElysiaJS Translation API..."

# 检查 Bun 是否已安装
if ! command -v bun &> /dev/null; then
    echo "❌ Bun is not installed. Please install Bun first:"
    echo "   curl -fsSL https://bun.sh/install | bash"
    exit 1
fi

# 安装依赖
echo "📦 Installing dependencies..."
bun install

# 复制环境变量文件
if [ ! -f .env ]; then
    echo "📝 Copying environment variables..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your database credentials and JWT secret"
fi

echo "✅ Setup completed!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your database configuration"
echo "2. Run: bun run db:generate"
echo "3. Run: bun run db:migrate"
echo "4. Run: bun run dev"
echo ""
echo "API will be available at: http://localhost:3000"
echo "Swagger docs at: http://localhost:3000/swagger"
