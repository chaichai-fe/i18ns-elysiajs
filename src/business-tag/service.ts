import db from '../db'
import { businessTagTable } from '../db/schema'
import { type CreateBusinessTagDto, type PaginationDto } from './types'
import { and, eq, isNull, sql } from 'drizzle-orm'
import { NotFoundError } from '../common/errors'

export class BusinessTagService {
  async create(createBusinessTagDto: CreateBusinessTagDto) {
    await db.insert(businessTagTable).values(createBusinessTagDto)
    return await db
      .select()
      .from(businessTagTable)
      .where(isNull(businessTagTable.deletedAt))
      .orderBy(sql`${businessTagTable.id} DESC`)
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
        .from(businessTagTable)
        .where(isNull(businessTagTable.deletedAt))
        .limit(pageSize)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)` })
        .from(businessTagTable)
        .where(isNull(businessTagTable.deletedAt)),
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
      .from(businessTagTable)
      .where(and(eq(businessTagTable.id, id), isNull(businessTagTable.deletedAt)))

    if (!deleted) {
      throw new NotFoundError('Business tag not found')
    }

    await db
      .update(businessTagTable)
      .set({
        deletedAt: sql`NOW()`,
        updatedAt: sql`NOW()`,
      })
      .where(and(eq(businessTagTable.id, id), isNull(businessTagTable.deletedAt)))

    return deleted
  }

  async update(id: number, updateBusinessTagDto: CreateBusinessTagDto) {
    await db
      .update(businessTagTable)
      .set({
        ...updateBusinessTagDto,
        updatedAt: sql`NOW()`,
      })
      .where(and(eq(businessTagTable.id, id), isNull(businessTagTable.deletedAt)))

    const updated = await db
      .select()
      .from(businessTagTable)
      .where(and(eq(businessTagTable.id, id), isNull(businessTagTable.deletedAt)))

    if (updated.length === 0) {
      throw new NotFoundError('Business tag not found')
    }

    return updated
  }

  async findById(id: number) {
    const result = await db
      .select()
      .from(businessTagTable)
      .where(and(eq(businessTagTable.id, id), isNull(businessTagTable.deletedAt)))

    if (result.length === 0) {
      throw new NotFoundError('Business tag not found')
    }

    return result
  }
}
