export interface ApiLog {
  id: number
  url: string
  method: string
  requestTime: Date
  requestParams: Record<string, any>
  createdAt: Date
}

export interface ApiLogQuery {
  page?: number
  pageSize?: number
  method?: string
  url?: string
}

export interface ApiLogResponse {
  logs: ApiLog[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}
