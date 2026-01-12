import { Elysia, t } from 'elysia'
import { bearer } from '@elysiajs/bearer'
import { jwt } from '@elysiajs/jwt'
import { TranslationsService } from './service'
import { env } from '../config/env'
import { BadRequestError, UnauthorizedError } from '../common/errors'

const translationsService = new TranslationsService()

export const translationsRoutes = new Elysia({ prefix: '/translations' })
  .use(
    jwt({
      name: 'jwt',
      secret: env.JWT_SECRET,
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
  .post(
    '/',
    async ({ body }) => {
      const result = await translationsService.create(body)
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
        business_tag_id: t.Number({ minimum: 1 }),
        translations: t.Object({}, { additionalProperties: true }),
      }),
    }
  )
  // 仅导出功能做 JWT 校验
  .get('/exportjson', async ({ bearer, jwt, set }) => {
    if (!bearer) {
      throw new UnauthorizedError('Authorization token required')
    }
    const payload = await jwt.verify(bearer)
    if (!payload) {
      throw new UnauthorizedError('Invalid token')
    }

    const translations = await translationsService.getTranslationsAsJson()
    set.headers['Content-Disposition'] = 'attachment; filename=translations.json'
    set.headers['Content-Type'] = 'application/json'
    return translations
  })
  .get(
    '/:id',
    async ({ params }) => {
      const id = Number(params.id)
      if (!Number.isInteger(id) || id <= 0) {
        throw new BadRequestError('id must be a positive integer')
      }
      const result = await translationsService.findById(id)
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
      const result = await translationsService.update(id, body)
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
        business_tag_id: t.Number({ minimum: 1 }),
        translations: t.Object({}, { additionalProperties: true }),
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
      const result = await translationsService.remove(id)
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
