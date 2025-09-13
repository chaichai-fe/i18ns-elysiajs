import db from '../db'
import { userTable } from '../db/schema'
import type { CreateUserDto, LoginUserDto, AuthResponse } from './types'
import { eq } from 'drizzle-orm'

export class AuthService {
  async register(
    createUserDto: CreateUserDto,
    signJWT: (payload: any) => Promise<string>
  ): Promise<AuthResponse> {
    // Check if user already exists
    const existingUser = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, createUserDto.email))

    if (existingUser.length > 0) {
      throw new Error('User already exists')
    }

    // Hash password using Bun's native password hashing
    const hashedPassword = await Bun.password.hash(createUserDto.password)

    // Create user
    await db.insert(userTable).values({
      ...createUserDto,
      password: hashedPassword,
    })

    // Get the newly created user
    const [user] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, createUserDto.email))

    if (!user) {
      throw new Error('Failed to retrieve created user')
    }

    // Generate JWT token
    const token = await signJWT({ userId: user.id })

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    }
  }

  async login(
    loginDto: LoginUserDto,
    signJWT: (payload: any) => Promise<string>
  ): Promise<AuthResponse> {
    // Find user
    const [user] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, loginDto.email))

    if (!user) {
      throw new Error('Invalid credentials')
    }

    // Verify password using Bun's native password verification
    const isPasswordValid = await Bun.password.verify(
      loginDto.password,
      user.password
    )

    if (!isPasswordValid) {
      throw new Error('Invalid credentials')
    }

    // Generate JWT token
    const token = await signJWT({ userId: user.id })

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    }
  }
}
