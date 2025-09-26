export interface CreateBusinessTagDto {
  name: string
  description: string
}

export interface BusinessTag {
  id: number
  name: string
  description: string
  createdAt: Date
  updatedAt: Date
}

export interface PaginationDto {
  page: number
  pageSize: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
