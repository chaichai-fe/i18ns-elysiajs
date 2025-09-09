import { Elysia, t } from 'elysia'
import { jwt } from '@elysiajs/jwt'
import { AuthService } from './service'
import type { CreateUserDto, LoginUserDto } from './types'

const authService = new AuthService()

export const authRoutes = new Elysia({ prefix: '/auth' })
    .use(
        jwt({
            name: 'jwt',
            secret: process.env.JWT_SECRET!,
            exp: '1d'
        })
    )
    .post('/register', async ({ body, jwt, set }) => {
        try {
            const result = await authService.register(body as CreateUserDto, jwt.sign)
            return {
                statusCode: 201,
                message: 'Registration successful',
                result,
            }
        } catch (error) {
            set.status = 409
            return {
                statusCode: 409,
                message: error instanceof Error ? error.message : 'Registration failed',
            }
        }
    }, {
        body: t.Object({
            name: t.String({ minLength: 2, maxLength: 50 }),
            email: t.String({ format: 'email' }),
            password: t.String({ minLength: 6, maxLength: 100 })
        })
    })
    .post('/login', async ({ body, jwt, set }) => {
        try {
            const result = await authService.login(body as LoginUserDto, jwt.sign)
            return {
                statusCode: 200,
                message: 'Login successful',
                result,
            }
        } catch (error) {
            set.status = 401
            return {
                statusCode: 401,
                message: error instanceof Error ? error.message : 'Login failed',
            }
        }
    }, {
        body: t.Object({
            email: t.String({ format: 'email' }),
            password: t.String({ minLength: 1 })
        })
    })
