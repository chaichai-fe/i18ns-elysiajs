import { Elysia, t } from 'elysia'
import { jwt } from '@elysiajs/jwt'
import { AuthService } from './service'
import { env } from '../env-config/env'

const authService = new AuthService()

export const authRoutes = new Elysia({ prefix: '/auth' })
  .use(
    jwt({
      name: 'jwt',
      secret: env.JWT_SECRET,
      exp: '1d',
    })
  )
  .post(
    '/register',
    async ({ body, jwt }) => {
      const result = await authService.register(body, jwt.sign)
      return {
        statusCode: 201,
        message: 'Registration successful',
        result,
      }
    },
    {
      body: t.Object({
        name: t.String({ minLength: 2, maxLength: 50 }),
        email: t.String({ format: 'email' }),
        password: t.String({ minLength: 6, maxLength: 100 }),
      }),
    }
  )
  .post(
    '/login',
    async ({ body, jwt }) => {
      const result = await authService.login(body, jwt.sign)
      return {
        statusCode: 200,
        message: 'Login successful',
        result,
      }
    },
    {
      body: t.Object({
        email: t.String({ format: 'email' }),
        password: t.String({ minLength: 1 }),
      }),
    }
  )
