import db from '../db'
import { businessTagTable } from '../db/schema'
import { type CreateBusinessTagDto } from './types'
import { eq, sql } from 'drizzle-orm'

export class BusinessTagService {
    async create(createBusinessTagDto: CreateBusinessTagDto) {
        await db.insert(businessTagTable).values(createBusinessTagDto)
        return await db
            .select()
            .from(businessTagTable)
            .orderBy(sql`${businessTagTable.id} DESC`)
            .limit(1)
    }

    async findAll() {
        return await db.select().from(businessTagTable)
    }

    async remove(id: number) {
        const [deleted] = await db
            .select()
            .from(businessTagTable)
            .where(eq(businessTagTable.id, id))

        await db.delete(businessTagTable).where(eq(businessTagTable.id, id))

        return deleted
    }

    async update(id: number, updateBusinessTagDto: CreateBusinessTagDto) {
        await db
            .update(businessTagTable)
            .set({
                ...updateBusinessTagDto,
                updatedAt: sql`NOW()`,
            })
            .where(eq(businessTagTable.id, id))

        return await db
            .select()
            .from(businessTagTable)
            .where(eq(businessTagTable.id, id))
    }

    async findById(id: number) {
        return await db
            .select()
            .from(businessTagTable)
            .where(eq(businessTagTable.id, id))
    }
}
