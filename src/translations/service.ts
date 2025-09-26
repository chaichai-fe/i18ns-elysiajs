import db from '../db'
import { translationTable, langTagTable } from '../db/schema'
import type { CreateTranslationDto } from './types'
import { eq, sql, inArray } from 'drizzle-orm'

export class TranslationsService {
  async create(createTranslationDto: CreateTranslationDto) {
    // Validate that all language keys in translation content exist in the lang_tags table
    await this.validateLanguageKeys(createTranslationDto.translations)

    await db.insert(translationTable).values(createTranslationDto)
    return await db
      .select()
      .from(translationTable)
      .orderBy(sql`${translationTable.id} DESC`)
      .limit(1)
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
      throw new Error('Translation content cannot be empty')
    }

    // Query existing language tags in the database
    const existingLangTags = await db
      .select({ name: langTagTable.name })
      .from(langTagTable)
      .where(inArray(langTagTable.name, Array.from(usedLangKeys)))

    const existingLangKeys = new Set(existingLangTags.map((tag) => tag.name))
    const invalidKeys = Array.from(usedLangKeys).filter(
      (key) => !existingLangKeys.has(key)
    )

    if (invalidKeys.length > 0) {
      throw new Error(
        `The following language keys do not exist in the language tags table: ${invalidKeys.join(
          ', '
        )}`
      )
    }
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
