import db from '../db'
import { langTagTable } from '../db/schema'
import type { CreateLangTagDto, PaginationDto } from './types'
import { eq, sql } from 'drizzle-orm'

export class LangTagService {
    async create(createLangTagDto: CreateLangTagDto) {
        await db.insert(langTagTable).values(createLangTagDto)
        return await db
            .select()
            .from(langTagTable)
            .orderBy(sql`${langTagTable.id} DESC`)
            .limit(1)
    }

    async findAll(paginationDto: PaginationDto) {
        // 兜底转换为数字
        const page = Number(paginationDto.page)
        const pageSize = Number(paginationDto.pageSize)
        const offset = (page - 1) * pageSize

        const [data, total] = await Promise.all([
            db.select().from(langTagTable).limit(pageSize).offset(offset),
            db.select({ count: sql<number>`count(*)` }).from(langTagTable),
        ])

        return {
            data,
            total: total[0]?.count ?? 0,
            page,
            pageSize,
            totalPages: Math.ceil(total[0]?.count ?? 0 / pageSize),
        }
    }

    async remove(id: number) {
        const [deleted] = await db
            .select()
            .from(langTagTable)
            .where(eq(langTagTable.id, id))

        await db.delete(langTagTable).where(eq(langTagTable.id, id))

        return deleted
    }

    async update(id: number, updateLangTagDto: CreateLangTagDto) {
        await db
            .update(langTagTable)
            .set({
                ...updateLangTagDto,
                updatedAt: sql`NOW()`,
            })
            .where(eq(langTagTable.id, id))

        return await db.select().from(langTagTable).where(eq(langTagTable.id, id))
    }

    async findById(id: number) {
        return await db.select().from(langTagTable).where(eq(langTagTable.id, id))
    }
}
