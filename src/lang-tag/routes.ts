import { Elysia, t } from 'elysia'
import { LangTagService } from './service'

const langTagService = new LangTagService()

export const langTagRoutes = new Elysia({ prefix: '/lang-tags' })
  .get(
    '/',
    async ({ query, set }) => {
      try {
        const page = Number(query.page ?? 1)
        const pageSize = Number(query.pageSize ?? 10)
        const result = await langTagService.findAll({ page, pageSize })
        return {
          statusCode: 200,
          message: 'find all success',
          result,
        }
      } catch (error) {
        set.status = 400
        return {
          statusCode: 400,
          message: error instanceof Error ? error.message : 'Query failed',
        }
      }
    },
    {
      query: t.Object({
        page: t.Optional(t.Number({ minimum: 1 })),
        pageSize: t.Optional(t.Number({ minimum: 1, maximum: 100 })),
      }),
    }
  )
  .post(
    '/',
    async ({ body, set }) => {
      try {
        const result = await langTagService.create(body)
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
    },
    {
      body: t.Object({
        name: t.String({ minLength: 2, maxLength: 100 }),
        description: t.String({ minLength: 5, maxLength: 500 }),
      }),
    }
  )
  .get('/:id', async ({ params, set }) => {
    try {
      const result = await langTagService.findById(+params.id)
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
  .put(
    '/:id',
    async ({ params, body, set }) => {
      try {
        const result = await langTagService.update(+params.id, body)
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
    },
    {
      body: t.Object({
        name: t.String({ minLength: 2, maxLength: 100 }),
        description: t.String({ minLength: 5, maxLength: 500 }),
      }),
    }
  )
  .delete('/:id', async ({ params, set }) => {
    try {
      const result = await langTagService.remove(+params.id)
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
