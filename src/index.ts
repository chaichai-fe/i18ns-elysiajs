import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { authRoutes } from './auth/routes'
import { businessTagRoutes } from './business-tag/routes'
import { langTagRoutes } from './lang-tag/routes'
import { translationsRoutes } from './translations/routes'
import { openapi } from '@elysiajs/openapi'
import { validateDatabaseConnection } from './db/connection'
import { env } from './config/env'
import { createErrorHandler } from './common/errors'

// Database connection validation and application startup function
async function startApplication() {
  try {
    console.log('🚀 Translation API is starting...')

    // Validate database connection
    const isDatabaseConnected = await validateDatabaseConnection()

    if (!isDatabaseConnected) {
      console.error(
        '💥 Application startup failed: Database connection validation failed'
      )
      process.exit(1)
    }

    // Create Elysia application
    const app = new Elysia()
      .onError(createErrorHandler(env))
      .use(
        cors({
          origin: true,
          methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
          credentials: true,
        })
      )
      .use(
        openapi({
          path: '/docs',
          documentation: {
            info: {
              title: 'I18n Translation API',
              version: '1.0.0',
            },
          },
        })
      )
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
      .listen(env.PORT)

    console.log('✅ Database connection validation passed')
    console.log(
      `🦊 Translation API is running: http://${app.server?.hostname}:${app.server?.port}`
    )
    console.log(
      `📚 API Documentation: http://${app.server?.hostname}:${app.server?.port}/docs`
    )
  } catch (error) {
    console.error('💥 Application startup failed:', error)
    process.exit(1)
  }
}

// Start the application
startApplication()
