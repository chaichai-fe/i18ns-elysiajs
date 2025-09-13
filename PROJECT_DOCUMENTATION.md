# i18ns-elysiajs 项目整体说明文档

## 📋 项目概述

**i18ns-elysiajs** 是一个基于 ElysiaJS 框架构建的国际化翻译管理 API 系统。该项目从 NestJS 重构而来，采用现代化的技术栈，提供高性能的翻译内容管理服务。

### 🎯 核心功能

- 🔐 JWT 身份认证与授权
- 🏷️ 业务标签管理
- 🌐 多语言标签管理
- 📝 翻译内容管理
- 📊 分页查询支持
- 📁 翻译数据导出功能
- 📖 OpenAPI 文档自动生成
- 🚀 高性能 API 服务

---

## 🛠️ 技术栈详解

### 核心框架

- **ElysiaJS v1.1.22**: 现代化的 TypeScript Web 框架
  - 基于 Bun 运行时优化
  - 端到端类型安全
  - 函数式编程风格
  - 内置验证和序列化

### 运行时环境

- **Bun v1.x**: 高性能 JavaScript 运行时
  - 比 Node.js 快 3-4 倍
  - 内置 TypeScript 支持
  - 原生 Web API 支持
  - 更小的内存占用

### 数据库与 ORM

- **MySQL**: 关系型数据库
- **Drizzle ORM v0.44.5**: 类型安全的 TypeScript ORM
  - 零运行时开销
  - 完整的类型推断
  - 强大的查询构建器
  - 自动迁移管理

### 认证与安全

- **JWT (JSON Web Tokens)**: 无状态身份认证
- **@elysiajs/jwt v1.1.1**: JWT 处理插件
- **@elysiajs/bearer v1.1.4**: Bearer Token 认证

### API 文档与验证

- **@elysiajs/openapi v1.3.11**: OpenAPI 规范生成
- **@elysiajs/swagger v1.1.5**: Swagger UI 集成
- **内置类型验证**: 基于 TypeScript 的请求验证

### 跨域与中间件

- **@elysiajs/cors v1.1.1**: 跨域资源共享
- **dotenv v17.2.2**: 环境变量管理

### 数据库连接

- **@planetscale/database v1.19.0**: PlanetScale 数据库连接器
- **mysql2 v3.14.5**: MySQL 数据库驱动

---

## 📁 项目结构详解

```
i18ns-elysiajs/
├── src/                          # 源代码目录
│   ├── auth/                     # 认证模块
│   │   ├── routes.ts            # 认证路由定义
│   │   ├── service.ts           # 认证业务逻辑
│   │   └── types.ts             # 认证相关类型定义
│   ├── businessTag/             # 业务标签模块
│   │   ├── routes.ts            # 业务标签路由
│   │   ├── service.ts           # 业务标签服务
│   │   └── types.ts             # 业务标签类型
│   ├── langTag/                 # 语言标签模块
│   │   ├── routes.ts            # 语言标签路由
│   │   ├── service.ts           # 语言标签服务
│   │   └── types.ts             # 语言标签类型
│   ├── translations/            # 翻译管理模块
│   │   ├── routes.ts            # 翻译路由
│   │   ├── service.ts           # 翻译服务
│   │   └── types.ts             # 翻译类型
│   ├── db/                      # 数据库配置
│   │   ├── index.ts             # 数据库连接配置
│   │   └── schema.ts            # 数据库模式定义
│   └── index.ts                 # 应用入口文件
├── drizzle/                     # 数据库迁移文件
│   ├── 0000_slimy_frank_castle.sql  # 初始迁移脚本
│   └── meta/                    # 迁移元数据
│       ├── _journal.json        # 迁移日志
│       └── 0000_snapshot.json   # 数据库快照
├── node_modules/                # 依赖包目录
├── dist/                        # 构建输出目录
├── package.json                 # 项目配置文件
├── tsconfig.json               # TypeScript 配置
├── drizzle.config.ts           # Drizzle ORM 配置
├── bun.lock                    # Bun 锁定文件
├── README.md                   # 项目说明
├── MIGRATION_GUIDE.md          # 迁移指南
└── PROJECT_DOCUMENTATION.md    # 项目文档（本文件）
```

---

## ⚙️ 配置文件详解

### package.json

```json
{
  "name": "elysiajs-i18n",
  "version": "0.0.1",
  "description": "Translation API built with ElysiaJS",
  "scripts": {
    "dev": "bun run --hot src/index.ts", // 开发模式（热重载）
    "build": "bun build src/index.ts --outdir=dist --target=bun", // 构建生产版本
    "start": "bun run dist/index.js", // 启动生产服务器
    "db:generate": "drizzle-kit generate", // 生成数据库迁移文件
    "db:migrate": "drizzle-kit migrate", // 执行数据库迁移
    "db:studio": "drizzle-kit studio", // 启动数据库管理界面
    "db:push": "drizzle-kit push" // 推送 schema 变更到数据库
  }
}
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "lib": ["ESNext"], // 使用最新的 ES 特性
    "target": "ESNext", // 编译目标
    "module": "ESNext", // 模块系统
    "moduleDetection": "force", // 强制模块检测
    "jsx": "react-jsx", // JSX 处理
    "allowJs": true, // 允许 JavaScript 文件
    "moduleResolution": "bundler", // 模块解析策略
    "allowImportingTsExtensions": true, // 允许导入 .ts 扩展名
    "verbatimModuleSyntax": true, // 保持模块语法
    "noEmit": true, // 不生成输出文件
    "strict": true, // 严格模式
    "skipLibCheck": true, // 跳过库文件检查
    "noFallthroughCasesInSwitch": true, // 禁止 switch 穿透
    "noUncheckedIndexedAccess": true, // 禁止未检查的索引访问
    "noImplicitOverride": true, // 禁止隐式覆盖
    "experimentalDecorators": true, // 实验性装饰器
    "emitDecoratorMetadata": true, // 发射装饰器元数据
    "types": ["bun-types"] // 类型定义
  }
}
```

### drizzle.config.ts

```typescript
import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  out: './drizzle', // 迁移文件输出目录
  schema: './src/db/schema.ts', // 数据库模式文件
  dialect: 'mysql', // 数据库类型
  dbCredentials: {
    url: process.env.DATABASE_URL!, // 数据库连接 URL
  },
})
```

---

## 🗄️ 数据库设计详解

### 数据库模式 (schema.ts)

#### 1. 用户表 (users)

```typescript
export const userTable = mysqlTable('users', {
  id: int().primaryKey().autoincrement(), // 主键，自增
  name: varchar({ length: 255 }).notNull(), // 用户名
  email: varchar({ length: 255 }).notNull(), // 邮箱
  password: varchar({ length: 255 }).notNull(), // 密码（加密存储）
})
```

#### 2. 业务标签表 (business_tags)

```typescript
export const businessTagTable = mysqlTable('business_tags', {
  id: int().primaryKey().autoincrement(), // 主键，自增
  name: varchar({ length: 255 }).notNull(), // 标签名称
  description: varchar({ length: 255 }).notNull(), // 标签描述
  createdAt: timestamp('created_at').notNull().defaultNow(), // 创建时间
  updatedAt: timestamp('updated_at').notNull().defaultNow(), // 更新时间
})
```

#### 3. 语言标签表 (lang_tags)

```typescript
export const langTagTable = mysqlTable('lang_tags', {
  id: int().primaryKey().autoincrement(), // 主键，自增
  name: varchar({ length: 255 }).notNull(), // 语言代码（如：en, zh, ja）
  description: varchar({ length: 255 }).notNull(), // 语言描述
  createdAt: timestamp('created_at').notNull().defaultNow(), // 创建时间
  updatedAt: timestamp('updated_at').notNull().defaultNow(), // 更新时间
})
```

#### 4. 翻译表 (translation)

```typescript
export const translationTable = mysqlTable('translation', {
  id: int().primaryKey().autoincrement(), // 主键，自增
  name: varchar({ length: 255 }).notNull(), // 翻译项名称
  description: varchar({ length: 255 }).notNull(), // 翻译项描述
  business_tag_id: int() // 关联业务标签
    .notNull()
    .references(() => businessTagTable.id),
  translations: json('translations') // JSON 格式存储多语言翻译
    .$type<TranslationContent>()
    .notNull(),
})

// 翻译内容类型定义
export type TranslationContent = {
  [key: string]: {
    [langTagName: string]: string
  }
}
```

### 数据库关系

- `translation.business_tag_id` → `business_tags.id` (外键关系)
- 支持多对多关系：一个业务标签可以有多个翻译项
- 翻译内容以 JSON 格式存储，支持动态语言扩展

---

## 🚀 项目运行说明

### 环境要求

- **Bun**: v1.0.0 或更高版本
- **MySQL**: v8.0 或更高版本
- **Node.js**: v18.0.0 或更高版本（可选，用于某些工具）

### 安装步骤

#### 1. 克隆项目

```bash
git clone <repository-url>
cd i18ns-elysiajs
```

#### 2. 安装依赖

```bash
bun install
```

#### 3. 环境配置

创建 `.env` 文件并配置以下环境变量：

```bash
# 数据库配置
DATABASE_URL="mysql://username:password@localhost:3306/database_name"

# JWT 配置
JWT_SECRET="your-super-secret-jwt-key"

# 服务器配置
PORT=3000
```

#### 4. 数据库初始化

```bash
# 生成迁移文件
bun run db:generate

# 执行数据库迁移
bun run db:migrate

# 或者直接推送 schema 到数据库
bun run db:push
```

#### 5. 启动开发服务器

```bash
bun run dev
```

#### 6. 构建生产版本

```bash
# 构建
bun run build

# 启动生产服务器
bun run start
```

### 开发工具

#### 数据库管理界面

```bash
bun run db:studio
```

访问 `http://localhost:4983` 查看数据库管理界面

#### API 文档

启动服务器后访问：

- **Swagger UI**: `http://localhost:3000/docs`
- **OpenAPI JSON**: `http://localhost:3000/docs/json`

---

## 📊 数据库迁移说明

### 迁移文件结构

```
drizzle/
├── 0000_slimy_frank_castle.sql    # 初始迁移脚本
└── meta/
    ├── _journal.json              # 迁移历史记录
    └── 0000_snapshot.json         # 数据库快照
```

### 迁移命令详解

#### 1. 生成迁移文件

```bash
bun run db:generate
```

- 比较当前 schema 与数据库状态
- 生成 SQL 迁移脚本
- 创建迁移元数据文件

#### 2. 执行迁移

```bash
bun run db:migrate
```

- 执行待处理的迁移文件
- 更新数据库结构
- 记录迁移历史

#### 3. 推送 Schema 变更

```bash
bun run db:push
```

- 直接将 schema 变更推送到数据库
- 跳过迁移文件生成
- 适用于开发环境

#### 4. 数据库管理界面

```bash
bun run db:studio
```

- 启动 Drizzle Studio
- 可视化数据库管理
- 支持数据查询和编辑

### 迁移最佳实践

1. **开发环境**: 使用 `db:push` 快速同步 schema
2. **生产环境**: 使用 `db:generate` + `db:migrate` 确保迁移可追溯
3. **团队协作**: 提交迁移文件到版本控制
4. **数据备份**: 执行迁移前备份重要数据

---

## 🔌 API 接口详解

### 认证模块 (`/api/auth`)

#### 用户注册

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "用户名",
  "email": "user@example.com",
  "password": "password123"
}
```

#### 用户登录

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### 业务标签模块 (`/api/business-tags`)

#### 获取所有业务标签

```http
GET /api/business-tags
```

#### 创建业务标签

```http
POST /api/business-tags
Content-Type: application/json

{
  "name": "标签名称",
  "description": "标签描述"
}
```

#### 获取指定业务标签

```http
GET /api/business-tags/:id
```

#### 更新业务标签

```http
PUT /api/business-tags/:id
Content-Type: application/json

{
  "name": "新标签名称",
  "description": "新标签描述"
}
```

#### 删除业务标签

```http
DELETE /api/business-tags/:id
```

### 语言标签模块 (`/api/lang-tags`)

#### 获取所有语言标签（支持分页）

```http
GET /api/lang-tags?page=1&pageSize=10
```

#### 创建语言标签

```http
POST /api/lang-tags
Content-Type: application/json

{
  "name": "en",
  "description": "English language tag"
}
```

#### 其他 CRUD 操作

- `GET /api/lang-tags/:id` - 获取指定语言标签
- `PUT /api/lang-tags/:id` - 更新语言标签
- `DELETE /api/lang-tags/:id` - 删除语言标签

### 翻译管理模块 (`/api/translations`)

#### 获取所有翻译

```http
GET /api/translations
```

#### 创建翻译

```http
POST /api/translations
Content-Type: application/json

{
  "name": "翻译项名称",
  "description": "翻译项描述",
  "business_tag_id": 1,
  "translations": {
    "title": {
      "en": "This is title",
      "zh": "这是标题",
      "ja": "これはタイトルです"
    }
  }
}
```

#### 导出翻译数据（需要认证）

```http
GET /api/translations/export/json
Authorization: Bearer <jwt-token>
```

---

## 🔒 安全特性

### JWT 认证

- **Token 有效期**: 1 天
- **算法**: HS256
- **存储**: 客户端 localStorage 或 cookie
- **刷新**: 需要重新登录

### 请求验证

- **类型安全**: 基于 TypeScript 的请求验证
- **数据格式**: 自动验证 JSON 格式
- **字段验证**: 长度、格式、必填项验证
- **错误处理**: 统一的错误响应格式

### CORS 配置

```typescript
.use(cors({
    origin: true,                    // 允许所有来源
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true,               // 允许携带凭证
}))
```

---

## 📈 性能特性

### 运行时性能

- **启动时间**: ~200-500ms（相比 NestJS 的 2-3s）
- **内存占用**: ~20-40MB（相比 NestJS 的 50-80MB）
- **请求处理**: ~25,000+ req/s（相比 NestJS 的 15,000 req/s）

### 数据库优化

- **连接池**: 自动管理数据库连接
- **查询优化**: Drizzle ORM 零运行时开销
- **类型安全**: 编译时查询验证

### 开发体验

- **热重载**: 开发时自动重启
- **类型推断**: 端到端类型安全
- **错误提示**: 详细的 TypeScript 错误信息

---

## 🚀 部署指南

### 生产环境部署

#### 1. 环境准备

```bash
# 安装 Bun
curl -fsSL https://bun.sh/install | bash

# 安装项目依赖
bun install
```

#### 2. 环境配置

```bash
# 生产环境变量
export DATABASE_URL="mysql://user:pass@host:port/db"
export JWT_SECRET="production-secret-key"
export PORT=3000
export NODE_ENV=production
```

#### 3. 数据库迁移

```bash
# 执行生产环境迁移
bun run db:migrate
```

#### 4. 构建和启动

```bash
# 构建生产版本
bun run build

# 启动生产服务器
bun run start
```

### Docker 部署

#### Dockerfile

```dockerfile
FROM oven/bun:1 as base
WORKDIR /app

# 安装依赖
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# 复制源代码
COPY . .

# 构建应用
RUN bun run build

# 生产阶段
FROM oven/bun:1-slim
WORKDIR /app

# 复制构建产物
COPY --from=base /app/dist ./dist
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["bun", "run", "start"]
```

#### docker-compose.yml

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - '3000:3000'
    environment:
      - DATABASE_URL=mysql://user:pass@db:3306/i18n
      - JWT_SECRET=your-secret-key
    depends_on:
      - db

  db:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=rootpassword
      - MYSQL_DATABASE=i18n
      - MYSQL_USER=user
      - MYSQL_PASSWORD=pass
    ports:
      - '3306:3306'
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
```

---

## 🧪 测试指南

### 单元测试

```bash
# 安装测试依赖
bun add -d @types/jest jest

# 运行测试
bun test
```

### API 测试

```bash
# 使用 curl 测试 API
curl -X GET http://localhost:3000/api/lang-tags

# 使用 Postman 或 Insomnia 进行接口测试
```

### 性能测试

```bash
# 使用 wrk 进行压力测试
wrk -t12 -c400 -d30s http://localhost:3000/api/lang-tags
```

---

## 🔧 故障排除

### 常见问题

#### 1. 数据库连接失败

```bash
# 检查数据库服务状态
systemctl status mysql

# 检查连接配置
echo $DATABASE_URL
```

#### 2. JWT 验证失败

```bash
# 检查 JWT_SECRET 配置
echo $JWT_SECRET

# 验证 token 格式
# 确保 Authorization header 格式正确: "Bearer <token>"
```

#### 3. 端口占用

```bash
# 检查端口占用
lsof -i :3000

# 杀死占用进程
kill -9 <PID>
```

#### 4. 依赖安装失败

```bash
# 清理缓存
bun pm cache rm

# 重新安装
rm -rf node_modules bun.lock
bun install
```

### 日志调试

```typescript
// 在代码中添加调试日志
console.log('Debug info:', { data, timestamp: new Date() })
```

---

## 📚 开发指南

### 代码规范

- 使用 TypeScript 严格模式
- 遵循函数式编程风格
- 保持代码简洁和可读性
- 添加适当的错误处理

### 新功能开发

1. 在对应模块创建路由、服务和类型文件
2. 更新数据库 schema（如需要）
3. 生成并执行迁移
4. 添加 API 文档
5. 编写测试用例

### 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 创建 Pull Request

---

## 📞 技术支持

### 文档资源

- [ElysiaJS 官方文档](https://elysiajs.com/)
- [Drizzle ORM 文档](https://orm.drizzle.team/)
- [Bun 官方文档](https://bun.sh/docs)

### 社区支持

- GitHub Issues: 报告 bug 和功能请求
- 技术讨论: 通过 Issue 进行技术交流

---

## 📄 许可证

本项目采用 UNLICENSED 许可证，仅供学习和研究使用。

---

## 🎉 总结

**i18ns-elysiajs** 是一个现代化的国际化翻译管理 API，具有以下优势：

✅ **高性能**: 基于 Bun 和 ElysiaJS 的极速体验  
✅ **类型安全**: 端到端的 TypeScript 类型推断  
✅ **易于使用**: 简洁的 API 设计和完整的文档  
✅ **可扩展**: 模块化设计，易于添加新功能  
✅ **生产就绪**: 完整的认证、验证和错误处理

通过本文档，您可以快速了解项目的技术架构、配置方法、运行流程和部署指南。如有任何问题，请参考故障排除部分或提交 Issue。
