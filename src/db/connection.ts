import 'dotenv/config'
import { drizzle } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'

/**
 * Validate database connection
 * @returns Promise<boolean> Returns true if connection succeeds, false if fails
 */
export async function validateDatabaseConnection(): Promise<boolean> {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    console.error('❌ DATABASE_URL environment variable is not set')
    return false
  }

  try {
    console.log('🔄 正在验证数据库连接...')

    // Create database connection
    const connection = await mysql.createConnection(connectionString)

    // Execute a simple query to validate the connection
    await connection.execute('SELECT 1 as test')

    // Close the connection
    await connection.end()

    console.log('✅ 数据库连接验证成功')
    return true
  } catch (error) {
    console.error('❌ 数据库连接验证失败:', error)
    return false
  }
}

/**
 * Initialize database connection
 * @returns Configured drizzle instance
 */
export function initializeDatabase() {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set')
  }

  console.log('🔄 正在初始化数据库连接...')
  const db = drizzle(connectionString)
  console.log('✅ 数据库连接初始化成功')

  return db
}
