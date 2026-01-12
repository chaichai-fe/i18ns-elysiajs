import { Elysia, t } from 'elysia'
import { BusinessTagService } from './service'
import { BadRequestError } from '../common/errors'

const businessTagService = new BusinessTagService()

export const businessTagRoutes = new Elysia({ prefix: '/business-tags' })
  .get(
    '/',
    async ({ query }) => {
      const page = Number(query.page ?? 1)
      const pageSize = Number(query.pageSize ?? 10)
      const result = await businessTagService.findAll({ page, pageSize })
      return {
        statusCode: 200,
        message: 'find all success',
        result,
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
    async ({ body }) => {
      const result = await businessTagService.create(body)
      return {
        statusCode: 201,
        message: 'create success',
        result,
      }
    },
    {
      body: t.Object({
        name: t.String({ minLength: 2, maxLength: 100 }),
        description: t.String({ minLength: 5, maxLength: 500 }),
      }),
    }
  )
  .get(
    '/:id',
    async ({ params }) => {
      const id = Number(params.id)
      if (!Number.isInteger(id) || id <= 0) {
        throw new BadRequestError('id must be a positive integer')
      }
      const result = await businessTagService.findById(id)
      return {
        statusCode: 200,
        message: 'find by id success',
        result,
      }
    },
    {
      params: t.Object({
        id: t.String({ pattern: '^[1-9]\\d*$' }),
      }),
    }
  )
  .put(
    '/:id',
    async ({ params, body }) => {
      const id = Number(params.id)
      if (!Number.isInteger(id) || id <= 0) {
        throw new BadRequestError('id must be a positive integer')
      }
      const result = await businessTagService.update(id, body)
      return {
        statusCode: 200,
        message: 'update success',
        result,
      }
    },
    {
      params: t.Object({
        id: t.String({ pattern: '^[1-9]\\d*$' }),
      }),
      body: t.Object({
        name: t.String({ minLength: 2, maxLength: 100 }),
        description: t.String({ minLength: 5, maxLength: 500 }),
      }),
    }
  )
  .delete(
    '/:id',
    async ({ params }) => {
      const id = Number(params.id)
      if (!Number.isInteger(id) || id <= 0) {
        throw new BadRequestError('id must be a positive integer')
      }
      const result = await businessTagService.remove(id)
      return {
        statusCode: 200,
        message: 'delete success',
        result,
      }
    },
    {
      params: t.Object({
        id: t.String({ pattern: '^[1-9]\\d*$' }),
      }),
    }
  )
