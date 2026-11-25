/**
 * Drizzle schema — better-auth tables.
 *
 * These tables are managed by better-auth via the Drizzle adapter.
 * Column names must match exactly what better-auth expects.
 * Kept in sync with the output of `npx @better-auth/cli generate`
 * (see auth-schema.ts), including the `username` plugin columns.
 *
 * Business tables (candidatures, analyses, cvs, contacts) live in
 * the FastAPI/SQLAlchemy side of the same PostgreSQL database.
 */

import { relations } from "drizzle-orm"
import {
  boolean,
  index,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core"

// ─── User ─────────────────────────────────────────────────────────────────────

export const user = pgTable("user", {
  id:              text("id").primaryKey(),
  name:            text("name").notNull(),
  email:           text("email").notNull().unique(),
  emailVerified:   boolean("email_verified").notNull().default(false),
  image:           text("image"),
  createdAt:       timestamp("created_at").notNull().defaultNow(),
  updatedAt:       timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  // `username` plugin
  username:        text("username").unique(),
  displayUsername: text("display_username"),
})

// ─── Session ─────────────────────────────────────────────────────────────────

export const session = pgTable(
  "session",
  {
    id:        text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token:     text("token").notNull().unique(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .$onUpdate(() => new Date()),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId:    text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
)

// ─── Account (OAuth providers) ───────────────────────────────────────────────

export const account = pgTable(
  "account",
  {
    id:                    text("id").primaryKey(),
    accountId:             text("account_id").notNull(),
    providerId:            text("provider_id").notNull(),
    userId:                text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken:           text("access_token"),
    refreshToken:          text("refresh_token"),
    idToken:               text("id_token"),
    accessTokenExpiresAt:  timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope:                 text("scope"),
    password:              text("password"),
    createdAt:             timestamp("created_at").notNull().defaultNow(),
    updatedAt:             timestamp("updated_at")
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
)

// ─── Verification (email / password reset tokens) ────────────────────────────

export const verification = pgTable(
  "verification",
  {
    id:         text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value:      text("value").notNull(),
    expiresAt:  timestamp("expires_at").notNull(),
    createdAt:  timestamp("created_at").notNull().defaultNow(),
    updatedAt:  timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
)

// ─── Relations ───────────────────────────────────────────────────────────────

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}))

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields:     [session.userId],
    references: [user.id],
  }),
}))

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields:     [account.userId],
    references: [user.id],
  }),
}))

// ─── Re-export types ─────────────────────────────────────────────────────────

export type User         = typeof user.$inferSelect
export type NewUser      = typeof user.$inferInsert
export type Session      = typeof session.$inferSelect
export type Account      = typeof account.$inferSelect
export type Verification = typeof verification.$inferSelect
