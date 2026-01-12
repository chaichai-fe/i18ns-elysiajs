import {
  int,
  mysqlTable,
  varchar,
  timestamp,
  json,
} from 'drizzle-orm/mysql-core'

export const businessTagTable = mysqlTable('business_tags', {
  id: int().primaryKey().autoincrement(),
  name: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 255 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
})

export const langTagTable = mysqlTable('lang_tags', {
  id: int().primaryKey().autoincrement(),
  name: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 255 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
})

/**
 * id:1001,
 * business_tag_id: 1,
 * translations:{
 *    title: {
 *       en: "this is title",
 *       zh: "This is title",
 *    }
 * }
 */

export type TranslationContent = {
  [key: string]: {
    [langTagName: string]: string
  }
}

export const translationTable = mysqlTable('translation', {
  id: int().primaryKey().autoincrement(),
  name: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 255 }).notNull(),
  business_tag_id: int()
    .notNull()
    .references(() => businessTagTable.id),
  translations: json('translations').$type<TranslationContent>().notNull(),
  deletedAt: timestamp('deleted_at'),
})

export const userTable = mysqlTable('users', {
  id: int().primaryKey().autoincrement(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull(),
  password: varchar({ length: 255 }).notNull(),
})
