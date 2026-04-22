/**
 * Drizzle ORM client — singleton PostgreSQL connection.
 *
 * Uses the `postgres` driver (pure JS, no native bindings needed).
 * The same PostgreSQL database is shared with the FastAPI backend:
 *   - Drizzle manages: better-auth tables (user, session, account, verification)
 *   - SQLAlchemy manages: business tables (candidatures, analyses, cvs, contacts)
 */

import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema"

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set")
}

/**
 * postgres-js client.
 * `max: 1` for serverless/edge environments (Next.js API routes).
 * Increase for long-running server processes.
 */
const client = postgres(connectionString, {
  max: 1,
  ssl: process.env.NODE_ENV === "production" ? "require" : false,
})

export const db = drizzle(client, { schema })
