export interface CreateUserDto {
  name: string
  email: string
  password: string
}

export interface LoginUserDto {
  email: string
  password: string
}

export interface User {
  id: number
  name: string
  email: string
}

export interface AuthResponse {
  user: User
  token: string
}
