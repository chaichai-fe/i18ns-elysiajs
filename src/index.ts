import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { authRoutes } from './auth/routes'
import { businessTagRoutes } from './business-tag/routes'
import { langTagRoutes } from './lang-tag/routes'
import { translationsRoutes } from './translations/routes'
import { apiLogRoutes } from './api-log/routes'
import { openapi } from '@elysiajs/openapi'
import { databaseHealthPlugin, apiLoggerPlugin } from './plugins'

// Application startup function
async function startApplication() {
  try {
    console.log('🚀 翻译API正在启动...')

    // Create Elysia application with database health check plugin
    const app = new Elysia()
      .use(databaseHealthPlugin) // 数据库健康检查插件会在启动时自动执行
      .use(apiLoggerPlugin) // API日志记录插件 - 全局使用
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
      .group(
        '/api',
        (app) =>
          app
            .use(authRoutes)
            .use(businessTagRoutes)
            .use(langTagRoutes)
            .use(translationsRoutes)
            .use(apiLogRoutes) // API日志查询路由
      )
      .get('/', () => ({
        message: 'I18n Translation API is running!',
        version: '1.0.0',
        docs: '/docs',
      }))
      .listen(process.env.PORT || 3000)

    console.log(
      `🦊 翻译API运行中: http://${app.server?.hostname}:${app.server?.port}`
    )
    console.log(
      `📚 API文档: http://${app.server?.hostname}:${app.server?.port}/docs`
    )
  } catch (error) {
    console.error('💥 应用启动失败:', error)
    process.exit(1)
  }
}

// Start the application
startApplication()
