import { Elysia, t } from 'elysia'
import { BusinessTagService } from './service'
import type { CreateBusinessTagDto } from './types'

const businessTagService = new BusinessTagService()

export const businessTagRoutes = new Elysia({ prefix: '/business-tags' })
    .get('/', async () => {
        const result = await businessTagService.findAll()
        return {
            statusCode: 200,
            message: 'find all success',
            result,
        }
    })
    .post('/', async ({ body, set }) => {
        try {
            const result = await businessTagService.create(body)
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
            description: t.String({ minLength: 5, maxLength: 500 })
        })
    })
    .get('/:id', async ({ params, set }) => {
        try {
            const result = await businessTagService.findById(+params.id)
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
            const result = await businessTagService.update(+params.id, body)
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
            description: t.String({ minLength: 5, maxLength: 500 })
        })
    })
    .delete('/:id', async ({ params, set }) => {
        try {
            const result = await businessTagService.remove(+params.id)
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
