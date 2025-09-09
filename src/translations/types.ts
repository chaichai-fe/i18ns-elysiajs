import type { TranslationContent } from '../db/schema'

export interface CreateTranslationDto {
    name: string
    description: string
    business_tag_id: number
    translations: TranslationContent
}

export interface Translation {
    id: number
    name: string
    description: string
    business_tag_id: number
    translations: TranslationContent
}
