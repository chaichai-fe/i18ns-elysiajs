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
