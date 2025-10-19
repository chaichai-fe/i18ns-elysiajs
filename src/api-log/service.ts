import db from '../db'
import { apiLogTable } from '../db/schema'
import { eq, desc } from 'drizzle-orm'

export interface ApiLogData {
  url: string
  method: string
  requestParams?: Record<string, any>
}

export class ApiLogService {
  /**
   * 记录API调用日志
   * @param logData API日志数据
   */
  async logApiCall(logData: ApiLogData): Promise<void> {
    try {
      await db.insert(apiLogTable).values({
        url: logData.url,
        method: logData.method,
        requestParams: logData.requestParams || {},
      })
    } catch (error) {
      console.error('❌ API日志记录失败:', error)
      // 不抛出错误，避免影响主要业务逻辑
    }
  }

  /**
   * 获取API日志列表
   * @param page 页码
   * @param pageSize 每页大小
   * @param method 过滤方法
   */
  async getApiLogs(page: number = 1, pageSize: number = 20, method?: string) {
    const offset = (page - 1) * pageSize

    let query = db
      .select()
      .from(apiLogTable)
      .orderBy(desc(apiLogTable.createdAt))
      .limit(pageSize)
      .offset(offset)

    if (method) {
      query = query.where(eq(apiLogTable.method, method.toUpperCase()))
    }

    const logs = await query
    const total = await db.select({ count: apiLogTable.id }).from(apiLogTable)

    return {
      logs,
      pagination: {
        page,
        pageSize,
        total: total.length,
        totalPages: Math.ceil(total.length / pageSize),
      },
    }
  }

  /**
   * 根据URL获取API日志
   * @param url API路径
   * @param page 页码
   * @param pageSize 每页大小
   */
  async getApiLogsByUrl(url: string, page: number = 1, pageSize: number = 20) {
    const offset = (page - 1) * pageSize

    const logs = await db
      .select()
      .from(apiLogTable)
      .where(eq(apiLogTable.url, url))
      .orderBy(desc(apiLogTable.createdAt))
      .limit(pageSize)
      .offset(offset)

    const total = await db
      .select({ count: apiLogTable.id })
      .from(apiLogTable)
      .where(eq(apiLogTable.url, url))

    return {
      logs,
      pagination: {
        page,
        pageSize,
        total: total.length,
        totalPages: Math.ceil(total.length / pageSize),
      },
    }
  }

  /**
   * 清理旧的API日志（保留最近30天）
   */
  async cleanOldLogs(): Promise<void> {
    try {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      await db
        .delete(apiLogTable)
        .where(eq(apiLogTable.createdAt, thirtyDaysAgo))

      console.log('✅ 旧API日志清理完成')
    } catch (error) {
      console.error('❌ 清理旧API日志失败:', error)
    }
  }

  /**
   * 清理所有API日志
   */
  async clearAllLogs(): Promise<void> {
    try {
      await db.delete(apiLogTable)
    } catch (error) {
      console.error('❌ 清理所有API日志失败:', error)
    }
  }
}
