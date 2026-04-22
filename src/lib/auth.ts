/**
 * better-auth configuration — uses Drizzle ORM adapter with PostgreSQL.
 *
 * Auth tables (user, session, account, verification) are managed by
 * better-auth via the Drizzle adapter and live in the shared PostgreSQL DB.
 *
 * Business tables (candidatures, analyses, cvs…) are managed by
 * the FastAPI/SQLAlchemy backend on the same database.
 */

import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "@/db/client"
import * as schema from "@/db/schema"

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  secret:  process.env.BETTER_AUTH_SECRET!,

  // ── Drizzle adapter — persists sessions and users in PostgreSQL ──────────
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user:         schema.user,
      session:      schema.session,
      account:      schema.account,
      verification: schema.verification,
    },
  }),

  // ── Email / password ──────────────────────────────────────────────────────
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Personal app — skip email verification
  },

  // ── OAuth providers ───────────────────────────────────────────────────────
  socialProviders: {
    google: {
      clientId:     process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    linkedin: {
      clientId:     process.env.LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
    },
  },

  // ── Session ───────────────────────────────────────────────────────────────
  session: {
    expiresIn: 60 * 60 * 24 * 7,  // 7 days
    updateAge: 60 * 60 * 24,       // Refresh if older than 1 day
  },

  trustedOrigins: [
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ],
})
