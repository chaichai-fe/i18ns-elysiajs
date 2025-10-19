import { Elysia } from 'elysia'
import { validateDatabaseConnection } from '../db/connection'

/**
 * Database Health Check Plugin
 * 在应用启动时检测数据库连接状态并打印相关信息
 */
export const databaseHealthPlugin = new Elysia({ name: 'database-health' })
  .onStart(async () => {
    console.log('🔍 开始检测数据库连接状态...')

    // 获取数据库URL信息（隐藏敏感信息）
    const databaseUrl = process.env.DATABASE_URL
    if (!databaseUrl) {
      console.error('❌ 数据库连接失败: DATABASE_URL 环境变量未设置')
      throw new Error('DATABASE_URL environment variable is not set')
    }

    // 解析并打印数据库连接信息（隐藏密码）
    try {
      const url = new URL(databaseUrl)
      const maskedUrl = `${url.protocol}//${url.hostname}:${
        url.port || '3306'
      }${url.pathname}`
      console.log(`📊 数据库连接信息: ${maskedUrl}`)
      console.log(
        `🔗 数据库类型: ${url.protocol.replace(':', '').toUpperCase()}`
      )
      console.log(`🏠 数据库主机: ${url.hostname}`)
      console.log(`🚪 数据库端口: ${url.port || '3306'}`)
      console.log(`📁 数据库名称: ${url.pathname.replace('/', '')}`)
    } catch (error) {
      console.warn('⚠️  无法解析数据库URL格式，使用原始URL（已隐藏密码）')
      const maskedUrl = databaseUrl.replace(/:([^:@]+)@/, ':***@')
      console.log(`📊 数据库连接信息: ${maskedUrl}`)
    }

    // 执行数据库连接检测
    const isConnected = await validateDatabaseConnection()

    if (!isConnected) {
      console.error('💥 数据库连接检测失败，应用启动终止')
      throw new Error('Database connection validation failed')
    }

    console.log('✅ 数据库连接检测成功，应用可以正常启动')
  })
  .onError(({ error }) => {
    console.error('💥 数据库健康检查插件错误:', error.message)
    process.exit(1)
  })
