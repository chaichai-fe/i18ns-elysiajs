import 'dotenv/config'

function requireString(name: string): string {
  const value = process.env[name]
  if (!value || value.trim() === '') {
    throw new Error(`${name} environment variable is not set`)
  }
  return value
}

function parsePort(value: string | undefined): number {
  if (!value) return 3000
  const port = Number.parseInt(value, 10)
  if (!Number.isFinite(port) || port <= 0 || port > 65535) {
    throw new Error(`PORT must be a valid integer between 1 and 65535`)
  }
  return port
}

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: parsePort(process.env.PORT),
  DATABASE_URL: requireString('DATABASE_URL'),
  JWT_SECRET: requireString('JWT_SECRET'),
} as const

