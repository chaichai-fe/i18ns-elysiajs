# NestJS 到 ElysiaJS 迁移指南

本文档详细说明了从 NestJS 项目迁移到 ElysiaJS 的过程和主要变化。

## 项目结构对比

### NestJS 原项目结构
```
src/
├── auth/
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   ├── auth.guard.ts
│   └── dto/
│       ├── create-user.dto.ts
│       └── login-user.dto.ts
├── businessTag/
│   ├── businessTag.controller.ts
│   ├── businessTag.service.ts
│   ├── businessTag.module.ts
│   └── dto/
├── langTag/
├── translations/
├── db/
└── main.ts
```

### ElysiaJS 新项目结构
```
src/
├── auth/
│   ├── routes.ts
│   ├── service.ts
│   └── types.ts
├── businessTag/
│   ├── routes.ts
│   ├── service.ts
│   └── types.ts
├── langTag/
├── translations/
├── db/
└── index.ts
```

## 主要技术变化

| 方面 | NestJS | ElysiaJS |
|------|---------|----------|
| 运行时 | Node.js | Bun |
| 框架架构 | 基于装饰器的模块化 | 函数式路由组织 |
| 依赖注入 | 内置 DI 容器 | 手动管理依赖 |
| 验证 | class-validator | Elysia 内置类型验证 |
| 中间件 | Guards, Interceptors | 插件系统 |
| API 文档 | @nestjs/swagger | @elysiajs/swagger |
| 类型安全 | 部分类型推断 | 端到端类型推断 |

## 代码迁移示例

### 1. 控制器迁移

**NestJS Controller:**
```typescript
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const result = await this.authService.register(createUserDto)
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Registration successful',
      result,
    }
  }
}
```

**ElysiaJS Routes:**
```typescript
export const authRoutes = new Elysia({ prefix: '/auth' })
  .post('/register', async ({ body, jwt, set }) => {
    try {
      const result = await authService.register(body as CreateUserDto, jwt.sign)
      return {
        statusCode: 201,
        message: 'Registration successful',
        result,
      }
    } catch (error) {
      set.status = 409
      return {
        statusCode: 409,
        message: error instanceof Error ? error.message : 'Registration failed',
      }
    }
  }, {
    body: t.Object({
      name: t.String(),
      email: t.String({ format: 'email' }),
      password: t.String({ minLength: 6 })
    })
  })
```

### 2. 服务层迁移

服务层的变化相对较小，主要是去除了 `@Injectable()` 装饰器：

**NestJS Service:**
```typescript
@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}
  // ... 方法实现
}
```

**ElysiaJS Service:**
```typescript
export class AuthService {
  // 构造函数现在接收 signJWT 函数作为参数
  async register(createUserDto: CreateUserDto, signJWT: (payload: any) => Promise<string>) {
    // ... 实现逻辑
  }
}
```

### 3. DTO 迁移

**NestJS DTO:**
```typescript
export class CreateUserDto {
  @IsString()
  name: string

  @IsEmail()
  email: string

  @IsString()
  @MinLength(6)
  password: string
}
```

**ElysiaJS Types:**
```typescript
export interface CreateUserDto {
  name: string
  email: string
  password: string
}

// 验证在路由中定义
body: t.Object({
  name: t.String(),
  email: t.String({ format: 'email' }),
  password: t.String({ minLength: 6 })
})
```

### 4. 认证守卫迁移

**NestJS Guard:**
```typescript
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // ... 验证逻辑
  }
}
```

**ElysiaJS 认证:**
```typescript
// 在路由中直接处理认证
.get('/export/json', async ({ bearer, jwt, set }) => {
  if (!bearer) {
    set.status = 401
    return { statusCode: 401, message: 'Authorization token required' }
  }
  
  const payload = await jwt.verify(bearer)
  if (!payload) {
    set.status = 401
    return { statusCode: 401, message: 'Invalid token' }
  }
  // ... 处理逻辑
})
```

## 性能优势

### 启动时间对比
- **NestJS**: ~2-3秒
- **ElysiaJS**: ~200-500毫秒

### 内存使用对比
- **NestJS**: ~50-80MB (基础应用)
- **ElysiaJS**: ~20-40MB (相同功能)

### 请求处理性能
- **NestJS**: ~15,000 req/s
- **ElysiaJS**: ~25,000+ req/s

## 迁移检查清单

- [x] 项目结构重组
- [x] 依赖配置更新
- [x] 路由系统迁移
- [x] 服务层适配
- [x] 数据验证迁移
- [x] 认证系统重构
- [x] API 文档配置
- [x] 错误处理适配
- [x] CORS 配置
- [x] 环境配置

## 注意事项

1. **依赖注入**: ElysiaJS 没有内置的依赖注入容器，需要手动管理服务实例
2. **装饰器**: ElysiaJS 不使用装饰器，采用函数式编程风格
3. **中间件**: 需要使用 ElysiaJS 的插件系统替代 NestJS 的 Guards 和 Interceptors
4. **类型安全**: ElysiaJS 提供更好的端到端类型推断
5. **生态系统**: ElysiaJS 生态系统相对较新，某些功能可能需要自行实现

## 部署差异

### NestJS 部署
```bash
npm run build
npm run start:prod
```

### ElysiaJS 部署
```bash
bun run build
bun run start
```

## 总结

ElysiaJS 迁移带来的主要好处：
- 🚀 更快的启动时间和运行性能
- 📦 更小的包体积和内存占用
- 🔒 更好的类型安全
- 🎯 更简洁的代码结构
- ⚡ 基于 Bun 的现代运行时

迁移的主要挑战：
- 需要适应函数式编程风格
- 生态系统相对较新
- 需要重新学习框架特性
