import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { authRoutes } from './auth/routes'
import { businessTagRoutes } from './businessTag/routes'
import { langTagRoutes } from './langTag/routes'
import { translationsRoutes } from './translations/routes'
import { openapi } from '@elysiajs/openapi'
import { checkDatabaseConnection, getDatabaseInfo } from './db'


const app = new Elysia()
    .use(cors({
        origin: true,
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
        credentials: true,
    }))
    .use(openapi({
        path: '/docs',
        documentation: {
            info: {
                title: 'I18n Translation API',
                version: '1.0.0',
            },
        },
    }))
    .group('/api', (app) =>
        app
            .use(authRoutes)
            .use(businessTagRoutes)
            .use(langTagRoutes)
            .use(translationsRoutes)
    )
    .get('/', () => ({
        message: 'I18n Translation API is running!',
        version: '1.0.0',
        docs: '/docs',
    }))
    .get('/health', async () => {
        const dbInfo = getDatabaseInfo();
        const isDbConnected = await checkDatabaseConnection();
        
        return {
            status: isDbConnected ? 'healthy' : 'unhealthy',
            timestamp: new Date().toISOString(),
            database: {
                host: dbInfo.host,
                database: dbInfo.database,
                connected: isDbConnected
            },
            version: '1.0.0'
        };
    })
    .listen(process.env.PORT || 3000)

// Database connection check during application startup
async function startApplication() {
    console.log('🚀 Starting Translation API...');
    
    // Display database connection information
    const dbInfo = getDatabaseInfo();
    console.log(`📊 Database info: ${dbInfo.host}/${dbInfo.database}`);
    
    // Check database connection
    const isDbConnected = await checkDatabaseConnection();
    
    if (!isDbConnected) {
        console.error('💥 Database connection failed, application cannot start!');
        console.error('Please check the following configurations:');
        console.error('1. DATABASE_URL environment variable is correctly set');
        console.error('2. Database service is running');
        console.error('3. Network connection is normal');
        console.error('4. Database user permissions are correct');
        process.exit(1);
    }
    
    console.log('✅ All system checks passed!');
    console.log(
        `🦊 Translation API is running: http://${app.server?.hostname}:${app.server?.port}`
    );
    console.log(`📚 API Documentation: http://${app.server?.hostname}:${app.server?.port}/docs`);
}

// Start the application
startApplication().catch((error) => {
    console.error('💥 Application startup failed:', error);
    process.exit(1);
});
