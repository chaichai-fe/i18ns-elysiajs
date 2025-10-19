import { Elysia, t } from 'elysia'
import { ApiLogService } from './service'

const apiLogService = new ApiLogService()

export const apiLogRoutes = new Elysia({ prefix: '/api-logs' })
  .get(
    '/',
    async ({ query, set }) => {
      try {
        const page = Number(query.page ?? 1)
        const pageSize = Number(query.pageSize ?? 20)
        const method = query.method
        const url = query.url

        let result
        if (url) {
          result = await apiLogService.getApiLogsByUrl(url, page, pageSize)
        } else {
          result = await apiLogService.getApiLogs(page, pageSize, method)
        }

        return {
          statusCode: 200,
          message: '获取API日志成功',
          result,
        }
      } catch (error) {
        set.status = 400
        return {
          statusCode: 400,
          message: error instanceof Error ? error.message : '查询失败',
        }
      }
    },
    {
      query: t.Object({
        page: t.Optional(t.Number({ minimum: 1 })),
        pageSize: t.Optional(t.Number({ minimum: 1, maximum: 100 })),
        method: t.Optional(t.String()),
        url: t.Optional(t.String()),
      }),
    }
  )
  .post('/clean', async ({ set }) => {
    try {
      await apiLogService.cleanOldLogs()
      return {
        statusCode: 200,
        message: '清理旧日志成功',
      }
    } catch (error) {
      set.status = 500
      return {
        statusCode: 500,
        message: error instanceof Error ? error.message : '清理失败',
      }
    }
  })
  .post('/clear-all', async ({ set }) => {
    try {
      await apiLogService.clearAllLogs()
      return {
        statusCode: 200,
        message: '清理所有日志成功',
      }
    } catch (error) {
      set.status = 500
      return {
        statusCode: 500,
        message: error instanceof Error ? error.message : '清理失败',
      }
    }
  })
