import { Elysia } from 'elysia'
import { ApiLogService } from '../api-log/service'

const apiLogService = new ApiLogService()

/**
 * API日志记录Plugin
 * 记录除了登录接口之外的所有API调用情况
 */
export const apiLoggerPlugin = new Elysia({ name: 'api-logger' })
  .onRequest(async ({ request, set }) => {
    const url = new URL(request.url)
    const pathname = url.pathname
    const method = request.method

    // 排除登录接口和API日志查询接口
    const excludedPaths = [
      '/auth/login',
      '/api/api-logs',
      '/docs',
      '/openapi.json',
    ]

    // 特殊处理根路径
    const isRootPath = pathname === '/'

    // 检查是否应该记录此API调用
    const shouldLog =
      !isRootPath && !excludedPaths.some((path) => pathname.startsWith(path))

    if (shouldLog) {
      try {
        // 获取请求参数
        let requestParams: Record<string, any> = {}

        // 处理查询参数
        if (url.searchParams.size > 0) {
          requestParams.query = Object.fromEntries(url.searchParams.entries())
        }

        // 处理POST/PUT/PATCH请求的body参数
        if (['POST', 'PUT', 'PATCH'].includes(method)) {
          try {
            const contentType = request.headers.get('content-type') || ''

            if (contentType.includes('application/json')) {
              const body = await request.clone().json()
              requestParams.body = body
            } else if (
              contentType.includes('application/x-www-form-urlencoded')
            ) {
              const formData = await request.clone().formData()
              requestParams.body = Object.fromEntries(formData.entries())
            }
          } catch (error) {
            // 如果解析body失败，记录错误但不影响主要流程
            requestParams.body = { error: 'Failed to parse request body' }
          }
        }

        // 异步记录API日志，不阻塞请求处理
        apiLogService
          .logApiCall({
            url: pathname,
            method,
            requestParams,
          })
          .catch((error) => {
            console.error('❌ API日志记录失败:', error)
          })

        console.log(`📝 API调用记录: ${method} ${pathname}`)
      } catch (error) {
        console.error('❌ API日志记录处理失败:', error)
      }
    }
  })
  .onError(({ error, request }) => {
    // 即使发生错误也记录API调用
    const url = new URL(request.url)
    const pathname = url.pathname
    const method = request.method

    const excludedPaths = [
      '/auth/login',
      '/api/api-logs',
      '/docs',
      '/openapi.json',
    ]

    const isRootPath = pathname === '/'
    const shouldLog =
      !isRootPath && !excludedPaths.some((path) => pathname.startsWith(path))

    if (shouldLog) {
      apiLogService
        .logApiCall({
          url: pathname,
          method,
          requestParams: {
            error: error instanceof Error ? error.message : 'Unknown error',
          },
        })
        .catch((logError) => {
          console.error('❌ 错误日志记录失败:', logError)
        })
    }
  })
