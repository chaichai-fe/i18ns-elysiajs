import db from '../db'
import { translationTable, langTagTable, businessTagTable } from '../db/schema'
import type { CreateTranslationDto } from './types'
import { and, eq, inArray, isNull, sql } from 'drizzle-orm'
import { BadRequestError, NotFoundError } from '../common/errors'

export class TranslationsService {
  async create(createTranslationDto: CreateTranslationDto) {
    await this.validateBusinessTagId(createTranslationDto.business_tag_id)

    // Validate that all language keys in translation content exist in the lang_tags table
    await this.validateLanguageKeys(createTranslationDto.translations)

    await db.insert(translationTable).values(createTranslationDto)
    return await db
      .select()
      .from(translationTable)
      .where(isNull(translationTable.deletedAt))
      .orderBy(sql`${translationTable.id} DESC`)
      .limit(1)
  }

  private async validateBusinessTagId(businessTagId: number): Promise<void> {
    const existing = await db
      .select({ id: businessTagTable.id })
      .from(businessTagTable)
      .where(and(eq(businessTagTable.id, businessTagId), isNull(businessTagTable.deletedAt)))
      .limit(1)

    if (existing.length === 0) {
      throw new BadRequestError('business_tag_id does not exist')
    }
  }

  /**
   * Validate that all language keys in translation content exist in the lang_tags table
   */
  private async validateLanguageKeys(
    translations: Record<string, Record<string, string>>
  ): Promise<void> {
    // Extract all used language keys
    const usedLangKeys = new Set<string>()
    for (const translationKey in translations) {
      for (const langKey in translations[translationKey]) {
        usedLangKeys.add(langKey)
      }
    }

    if (usedLangKeys.size === 0) {
      throw new BadRequestError('Translation content cannot be empty')
    }

    // Query existing language tags in the database
    const existingLangTags = await db
      .select({ name: langTagTable.name })
      .from(langTagTable)
      .where(
        and(
          inArray(langTagTable.name, Array.from(usedLangKeys)),
          isNull(langTagTable.deletedAt)
        )
      )

    const existingLangKeys = new Set(existingLangTags.map((tag) => tag.name))
    const invalidKeys = Array.from(usedLangKeys).filter(
      (key) => !existingLangKeys.has(key)
    )

    if (invalidKeys.length > 0) {
      throw new BadRequestError(
        `The following language keys do not exist in the language tags table: ${invalidKeys.join(
          ', '
        )}`
      )
    }
  }

  async findAll() {
    return await db
      .select({
        id: translationTable.id,
        name: translationTable.name,
        description: translationTable.description,
        business_tag_id: translationTable.business_tag_id,
        translations: translationTable.translations,
      })
      .from(translationTable)
      .innerJoin(
        businessTagTable,
        eq(translationTable.business_tag_id, businessTagTable.id)
      )
      .where(and(isNull(translationTable.deletedAt), isNull(businessTagTable.deletedAt)))
  }

  async remove(id: number) {
    const [deleted] = await db
      .select()
      .from(translationTable)
      .where(and(eq(translationTable.id, id), isNull(translationTable.deletedAt)))

    if (!deleted) {
      throw new NotFoundError('Translation not found')
    }

    await db
      .update(translationTable)
      .set({
        deletedAt: sql`NOW()`,
      })
      .where(and(eq(translationTable.id, id), isNull(translationTable.deletedAt)))

    return deleted
  }

  async update(id: number, updateTranslationDto: CreateTranslationDto) {
    await this.validateBusinessTagId(updateTranslationDto.business_tag_id)
    await this.validateLanguageKeys(updateTranslationDto.translations)

    await db
      .update(translationTable)
      .set(updateTranslationDto)
      .where(and(eq(translationTable.id, id), isNull(translationTable.deletedAt)))

    const updated = await db
      .select({
        id: translationTable.id,
        name: translationTable.name,
        description: translationTable.description,
        business_tag_id: translationTable.business_tag_id,
        translations: translationTable.translations,
      })
      .from(translationTable)
      .innerJoin(
        businessTagTable,
        eq(translationTable.business_tag_id, businessTagTable.id)
      )
      .where(
        and(
          eq(translationTable.id, id),
          isNull(translationTable.deletedAt),
          isNull(businessTagTable.deletedAt)
        )
      )

    if (updated.length === 0) {
      throw new NotFoundError('Translation not found')
    }

    return updated
  }

  async findById(id: number) {
    const result = await db
      .select({
        id: translationTable.id,
        name: translationTable.name,
        description: translationTable.description,
        business_tag_id: translationTable.business_tag_id,
        translations: translationTable.translations,
      })
      .from(translationTable)
      .innerJoin(
        businessTagTable,
        eq(translationTable.business_tag_id, businessTagTable.id)
      )
      .where(
        and(
          eq(translationTable.id, id),
          isNull(translationTable.deletedAt),
          isNull(businessTagTable.deletedAt)
        )
      )

    if (result.length === 0) {
      throw new NotFoundError('Translation not found')
    }

    return result
  }

  async getTranslationsAsJson() {
    const translations = await db
      .select({
        translations: translationTable.translations,
      })
      .from(translationTable)
      .innerJoin(
        businessTagTable,
        eq(translationTable.business_tag_id, businessTagTable.id)
      )
      .where(and(isNull(translationTable.deletedAt), isNull(businessTagTable.deletedAt)))
    return translations
  }
}
