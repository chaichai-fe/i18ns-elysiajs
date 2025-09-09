import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { authRoutes } from './auth/routes'
import { businessTagRoutes } from './businessTag/routes'
import { langTagRoutes } from './langTag/routes'
import { translationsRoutes } from './translations/routes'
import { openapi } from '@elysiajs/openapi'


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
    .listen(process.env.PORT || 3000)

console.log(
    `🦊 Translation API is running at http://${app.server?.hostname}:${app.server?.port}`
)
