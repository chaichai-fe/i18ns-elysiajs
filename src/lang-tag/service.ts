import db from '../db'
import { langTagTable } from '../db/schema'
import type { CreateLangTagDto, PaginationDto } from './types'
import { and, eq, isNull, sql } from 'drizzle-orm'

export class LangTagService {
  async create(createLangTagDto: CreateLangTagDto) {
    await db.insert(langTagTable).values(createLangTagDto)
    return await db
      .select()
      .from(langTagTable)
      .where(isNull(langTagTable.deletedAt))
      .orderBy(sql`${langTagTable.id} DESC`)
      .limit(1)
  }

  async findAll(paginationDto: PaginationDto) {
    // Fallback conversion to numbers
    const page = Number(paginationDto.page)
    const pageSize = Number(paginationDto.pageSize)
    const offset = (page - 1) * pageSize

    const [data, total] = await Promise.all([
      db
        .select()
        .from(langTagTable)
        .where(isNull(langTagTable.deletedAt))
        .limit(pageSize)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)` })
        .from(langTagTable)
        .where(isNull(langTagTable.deletedAt)),
    ])

    const totalCount = total[0]?.count ?? 0
    return {
      data,
      total: totalCount,
      page,
      pageSize,
      totalPages: Math.ceil(totalCount / pageSize),
    }
  }

  async remove(id: number) {
    const [deleted] = await db
      .select()
      .from(langTagTable)
      .where(and(eq(langTagTable.id, id), isNull(langTagTable.deletedAt)))

    await db
      .update(langTagTable)
      .set({
        deletedAt: sql`NOW()`,
        updatedAt: sql`NOW()`,
      })
      .where(and(eq(langTagTable.id, id), isNull(langTagTable.deletedAt)))

    return deleted
  }

  async update(id: number, updateLangTagDto: CreateLangTagDto) {
    await db
      .update(langTagTable)
      .set({
        ...updateLangTagDto,
        updatedAt: sql`NOW()`,
      })
      .where(and(eq(langTagTable.id, id), isNull(langTagTable.deletedAt)))

    return await db
      .select()
      .from(langTagTable)
      .where(and(eq(langTagTable.id, id), isNull(langTagTable.deletedAt)))
  }

  async findById(id: number) {
    return await db
      .select()
      .from(langTagTable)
      .where(and(eq(langTagTable.id, id), isNull(langTagTable.deletedAt)))
  }
}
