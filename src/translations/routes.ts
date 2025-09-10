import { Elysia, t } from 'elysia'
import { bearer } from '@elysiajs/bearer'
import { jwt } from '@elysiajs/jwt'
import { TranslationsService } from './service'
import type { CreateTranslationDto } from './types'

const translationsService = new TranslationsService()

export const translationsRoutes = new Elysia({ prefix: '/translations' })
    .use(
        jwt({
            name: 'jwt',
            secret: process.env.JWT_SECRET!,
        })
    )
    .use(bearer())
    .get('/', async () => {
        const result = await translationsService.findAll()
        return {
            statusCode: 200,
            message: 'find all success',
            result,
        }
    })
    .post('/', async ({ body, set }) => {
        try {
            const result = await translationsService.create(body as CreateTranslationDto)
            return {
                statusCode: 201,
                message: 'create success',
                result,
            }
        } catch (error) {
            set.status = 400
            return {
                statusCode: 400,
                message: error instanceof Error ? error.message : 'Create failed',
            }
        }
    }, {
        body: t.Object({
            name: t.String({ minLength: 2, maxLength: 100 }),
            description: t.String({ minLength: 5, maxLength: 500 }),
            business_tag_id: t.Number({ minimum: 1 }),
            translations: t.Object({}, { additionalProperties: true })
        })
    })
    .get('/:id', async ({ params, set }) => {
        try {
            const result = await translationsService.findById(+params.id)
            return {
                statusCode: 200,
                message: 'find by id success',
                result,
            }
        } catch (error) {
            set.status = 404
            return {
                statusCode: 404,
                message: error instanceof Error ? error.message : 'Not found',
            }
        }
    })
    .put('/:id', async ({ params, body, set }) => {
        try {
            const result = await translationsService.update(+params.id, body as CreateTranslationDto)
            return {
                statusCode: 200,
                message: 'update success',
                result,
            }
        } catch (error) {
            set.status = 400
            return {
                statusCode: 400,
                message: error instanceof Error ? error.message : 'Update failed',
            }
        }
    }, {
        body: t.Object({
            name: t.String({ minLength: 2, maxLength: 100 }),
            description: t.String({ minLength: 5, maxLength: 500 }),
            business_tag_id: t.Number({ minimum: 1 }),
            translations: t.Object({}, { additionalProperties: true })
        })
    })
    .delete('/:id', async ({ params, set }) => {
        try {
            const result = await translationsService.remove(+params.id)
            return {
                statusCode: 200,
                message: 'delete success',
                result,
            }
        } catch (error) {
            set.status = 404
            return {
                statusCode: 404,
                message: error instanceof Error ? error.message : 'Delete failed',
            }
        }
    })
    // 需要认证的导出接口
    .get('/export/json', async ({ bearer, jwt, set }) => {
        try {
            // 验证有无bearer
            if (!bearer) {
                set.status = 401
                return {
                    statusCode: 401,
                    message: 'Authorization token required',
                }
            }

            // 验证JWT token是否有效
            const payload = await jwt.verify(bearer)
            if (!payload) {
                set.status = 401
                return {
                    statusCode: 401,
                    message: 'Invalid token',
                }
            }

            const translations = await translationsService.getTranslationsAsJson()

            set.headers['Content-Disposition'] = 'attachment; filename=translations.json'
            set.headers['Content-Type'] = 'application/json'

            return translations
        } catch (error) {
            set.status = 500
            return {
                statusCode: 500,
                message: error instanceof Error ? error.message : 'Export failed',
            }
        }
    })
