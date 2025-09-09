import db from '../db'
import { translationTable } from '../db/schema'
import type { CreateTranslationDto } from './types'
import { eq, sql } from 'drizzle-orm'

export class TranslationsService {
    async create(createTranslationDto: CreateTranslationDto) {
        await db.insert(translationTable).values(createTranslationDto)
        return await db
            .select()
            .from(translationTable)
            .orderBy(sql`${translationTable.id} DESC`)
            .limit(1)
    }

    async findAll() {
        return await db.select().from(translationTable)
    }

    async remove(id: number) {
        const [deleted] = await db
            .select()
            .from(translationTable)
            .where(eq(translationTable.id, id))

        await db.delete(translationTable).where(eq(translationTable.id, id))

        return deleted
    }

    async update(id: number, updateTranslationDto: CreateTranslationDto) {
        await db
            .update(translationTable)
            .set(updateTranslationDto)
            .where(eq(translationTable.id, id))

        return await db
            .select()
            .from(translationTable)
            .where(eq(translationTable.id, id))
    }

    async findById(id: number) {
        return await db
            .select()
            .from(translationTable)
            .where(eq(translationTable.id, id))
    }

    async getTranslationsAsJson() {
        const translations = await db
            .select({
                translations: translationTable.translations,
            })
            .from(translationTable)
        return translations
    }
}
