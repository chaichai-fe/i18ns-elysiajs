# Translation API - ElysiaJS

这是一个使用 ElysiaJS 构建的翻译管理 API，从 NestJS 项目重构而来。

## 功能特性

- 🔐 JWT 身份认证
- 🏷️ 业务标签管理
- 🌐 语言标签管理
- 📝 翻译内容管理
- 📊 分页查询支持
- 📁 翻译导出功能
- 📖 Open API 文档

## 技术栈

- **框架**: ElysiaJS
- **数据库**: MySQL
- **ORM**: Drizzle ORM
- **运行时**: Bun
- **认证**: JWT
- **文档**: OpenAPI

## 快速开始

### 安装依赖

```bash
bun install
```

### 环境配置

复制 `.env.example` 到 `.env` 并配置相应的环境变量：

```bash
cp .env.example .env
```

### 数据库迁移

```bash
# 生成迁移文件
bun run db:generate

# 执行迁移
bun run db:migrate
```

### 启动开发服务器

```bash
bun run dev
```

### 构建和生产部署

```bash
# 构建
bun run build

# 启动生产服务器
bun run start
```

## API 文档

启动服务器后，访问 `http://localhost:3000/docs` 查看完整的 API 文档。

## 主要端点

### 认证

- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录

### 业务标签

- `GET /api/business-tags` - 获取所有业务标签
- `POST /api/business-tags` - 创建业务标签
- `GET /api/business-tags/:id` - 获取指定业务标签
- `PUT /api/business-tags/:id` - 更新业务标签
- `DELETE /api/business-tags/:id` - 删除业务标签

### 语言标签

- `GET /api/lang-tags` - 获取所有语言标签（支持分页）
- `POST /api/lang-tags` - 创建语言标签
- `GET /api/lang-tags/:id` - 获取指定语言标签
- `PUT /api/lang-tags/:id` - 更新语言标签
- `DELETE /api/lang-tags/:id` - 删除语言标签

### 翻译管理

- `GET /api/translations` - 获取所有翻译
- `POST /api/translations` - 创建翻译
- `GET /api/translations/:id` - 获取指定翻译
- `PUT /api/translations/:id` - 更新翻译
- `DELETE /api/translations/:id` - 删除翻译
- `GET /api/translations/export/json` - 导出翻译为 JSON（需要认证）

## 数据库工具

```bash
# 查看数据库
bun run db:studio

# 推送 schema 变更到数据库
bun run db:push
```

## 项目结构

```
src/
├── auth/           # 认证模块
├── businessTag/    # 业务标签模块
├── langTag/        # 语言标签模块
├── translations/   # 翻译模块
├── db/            # 数据库配置和 schema
└── index.ts       # 应用入口文件
```

## 性能优势

- **更快的启动时间**: 得益于 Bun 运行时
- **更小的内存占用**: ElysiaJS 的轻量级设计
- **更好的类型安全**: 端到端的 TypeScript 类型推断
- **更简洁的代码**: 减少样板代码和装饰器
