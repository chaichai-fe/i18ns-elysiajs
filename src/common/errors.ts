export class AppError extends Error {
  readonly status: number
  readonly code: string
  readonly details?: unknown

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message)
    this.status = status
    this.code = code
    this.details = details
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Bad Request', details?: unknown) {
    super(400, 'BAD_REQUEST', message, details)
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized', details?: unknown) {
    super(401, 'UNAUTHORIZED', message, details)
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Not Found', details?: unknown) {
    super(404, 'NOT_FOUND', message, details)
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflict', details?: unknown) {
    super(409, 'CONFLICT', message, details)
  }
}

type EnvLike = { NODE_ENV: string }

export function createErrorHandler(appEnv: EnvLike) {
  // Elysia 的 onError context 类型比较复杂，这里保持“结构化取值 + 宽类型”
  // 来避免在入口处引入大量泛型/联合类型噪音。
  return (context: any) => {
    const code = context?.code as string
    const error = context?.error as unknown
    const set = context?.set as any

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

