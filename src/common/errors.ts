/**
 * 统一错误与错误处理（Elysia onError）
 *
 * 使用方式：
 * - 业务/路由层：`throw new BadRequestError(...)` / `throw new NotFoundError(...)` 等
 * - 入口：`app.onError(createErrorHandler(env))`
 *
 * 目标：
 * - 业务错误（AppError 子类）可控、可预期：状态码/错误码/消息由我们定义
 * - 框架错误（例如参数校验失败）统一映射为稳定的错误响应结构
 */
export class AppError extends Error {
  /** HTTP 状态码，例如 400/401/404/409 */
  readonly status: number
  /** 业务错误码，用于前端/调用方稳定识别 */
  readonly code: string
  /** 可选的调试/上下文信息（会原样返回到响应中） */
  readonly details?: unknown

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message)
    this.status = status
    this.code = code
    this.details = details
  }
}

/** 400 - 参数错误 / 请求不合法 */
export class BadRequestError extends AppError {
  constructor(message = 'Bad Request', details?: unknown) {
    super(400, 'BAD_REQUEST', message, details)
  }
}

/** 401 - 未登录 / token 缺失或无效 */
export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized', details?: unknown) {
    super(401, 'UNAUTHORIZED', message, details)
  }
}

/** 404 - 资源不存在 */
export class NotFoundError extends AppError {
  constructor(message = 'Not Found', details?: unknown) {
    super(404, 'NOT_FOUND', message, details)
  }
}

/** 409 - 冲突（例如唯一约束冲突、重复注册等） */
export class ConflictError extends AppError {
  constructor(message = 'Conflict', details?: unknown) {
    super(409, 'CONFLICT', message, details)
  }
}

type EnvLike = { NODE_ENV: string }

/**
 * 创建全局错误处理器（用于 Elysia `.onError(...)`）
 *
 * 处理优先级：
 * 1) AppError：完全按我们定义的 status/code/message/details 返回
 * 2) 框架错误码（VALIDATION / PARSE / NOT_FOUND）：通过 MAP 统一映射
 * 3) 兜底：500 + INTERNAL_SERVER_ERROR，并打印日志
 *
 * 响应结构固定为：
 * `{ success: false, statusCode, error: { code, message, details? } }`
 */
export function createErrorHandler(appEnv: EnvLike) {
  // Elysia 的 onError context 类型比较复杂，这里保持“结构化取值 + 宽类型”
  // 来避免在入口处引入大量泛型/联合类型噪音。
  return (context: any) => {
    const code = context?.code as string
    const error = context?.error as unknown
    const set = context?.set as any

    /**
     * 统一构造错误响应体，并同步写入 HTTP 状态码（`set.status`）
     */
    const toErrorResponse = (
      status: number,
      errorCode: string,
      message: string,
      details?: unknown
    ) => {
      if (set) set.status = status
      return {
        success: false,
        statusCode: status,
        error: {
          code: errorCode,
          message,
          ...(details !== undefined ? { details } : {}),
        },
      }
    }

    if (error instanceof AppError) {
      return toErrorResponse(error.status, error.code, error.message, error.details)
    }

    /**
     * Elysia 内置错误码 → 我们的错误响应映射表
     * - VALIDATION：body/query/params/schema 校验失败
     * - PARSE：请求体解析失败（常见为 JSON 格式错误）
     * - NOT_FOUND：路由未匹配
     */
    const codeMap: Record<string, (err: unknown) => any> = {
      VALIDATION: (err) =>
        toErrorResponse(
          400,
          'VALIDATION_ERROR',
          err instanceof Error ? err.message : 'Validation error',
          err
        ),
      NOT_FOUND: () => toErrorResponse(404, 'NOT_FOUND', 'Not Found'),
      PARSE: (err) =>
        toErrorResponse(
          400,
          'PARSE_ERROR',
          err instanceof Error ? err.message : 'Parse error',
          err
        ),
    }

    const handler = codeMap[code]
    if (handler) {
      return (
        handler(error) ??
        toErrorResponse(500, 'INTERNAL_SERVER_ERROR', 'Internal Server Error', error)
      )
    }

    console.error('💥 Unhandled error:', error)
    return toErrorResponse(
      500,
      'INTERNAL_SERVER_ERROR',
      error instanceof Error ? error.message : 'Internal Server Error',
      error
    )
  }
}

