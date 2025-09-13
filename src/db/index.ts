import 'dotenv/config'
import { drizzle } from 'drizzle-orm/mysql2'

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set')
}

const db = drizzle(connectionString)

export default db
