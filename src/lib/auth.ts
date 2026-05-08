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
import { customSession, username } from "better-auth/plugins"
import { nextCookies } from "better-auth/next-js"
import { dataToEncryption, sendEncryptedCredentials } from "./security"
import { syncProfile } from "@/app/(auth)/helper"

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET!,

  // ── Drizzle adapter — persists sessions and users in PostgreSQL ──────────
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,

  }),

  // ── Email / password ──────────────────────────────────────────────────────
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Personal app — skip email verification
  },

  plugins: [
    username(), nextCookies(),
    customSession(
      async ({ session, user }) => {
        const { token, expires_at } = await exchangeToken(user)
        return {
          ...session,
          user: {
            ...user,
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            api: {
              token: token,
              expires_at: expires_at,
            }
          },
        }
      }
    )


  ],

  // ── OAuth providers ───────────────────────────────────────────────────────
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    linkedin: {
      clientId: process.env.LINKEDIN_CLIENT_ID!,
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



export const exchangeToken = async (user: any) => {
  // Token exchange with FastAPI — one call, then FastAPI is autonomous
  let token = null
  let expires_at = null
  const encryptedData = await sendEncryptedCredentials({
    email: user.email,
    first_name: user.name?.split(" ")[0] || "",
    last_name: user.name?.split(" ")[1] || "",
    auth_provider: "email",
  })


  if (encryptedData) {
    const response = await syncProfile(encryptedData)
    token = response?.token
    expires_at = response?.expires_at
  }

  return {
    token,
    expires_at,
  }

}