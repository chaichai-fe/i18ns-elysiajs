import 'dotenv/config';
import { drizzle } from "drizzle-orm/mysql2";
import { sql } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL!);

// Database health check function
export async function checkDatabaseConnection(): Promise<boolean> {
    try {
        console.log('🔍 Checking database connection...');
        
        // Execute a simple query to test the connection
        await db.execute(sql`SELECT 1 as test`);
        
        console.log('✅ Database connection successful!');
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        return false;
    }
}

// Get database connection information (without sensitive data)
export function getDatabaseInfo(): { host: string; database: string; connected: boolean } {
    try {
        const url = new URL(process.env.DATABASE_URL!);
        return {
            host: url.hostname,
            database: url.pathname.slice(1), // Remove leading '/'
            connected: true
        };
    } catch (error) {
        console.error('❌ Unable to parse database URL:', error);
        return {
            host: 'unknown',
            database: 'unknown',
            connected: false
        };
    }
}

export default db