import { drizzle } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'
import { env } from '../config/env'

/**
 * Validate database connection
 * @returns Promise<boolean> Returns true if connection succeeds, false if fails
 */
export async function validateDatabaseConnection(): Promise<boolean> {
  try {
    console.log('🔄 Validating database connection...')

    // Create database connection
    const connection = await mysql.createConnection(env.DATABASE_URL)

    // Execute a simple query to validate the connection
    await connection.execute('SELECT 1 as test')

    // Close the connection
    await connection.end()

    console.log('✅ Database connection validation successful')
    return true
  } catch (error) {
    console.error('❌ Database connection validation failed:', error)
    return false
  }
}

/**
 * Initialize database connection
 * @returns Configured drizzle instance
 */
export function initializeDatabase() {
  console.log('🔄 Initializing database connection...')
  const db = drizzle(env.DATABASE_URL)
  console.log('✅ Database connection initialization successful')

  return db
}
