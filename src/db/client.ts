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

/**
 * `next build` imports every route to collect its page data, which evaluates
 * this module where no database is reachable: a Docker build has no .env.
 * Nothing queries during the build and postgres-js only connects on its first
 * query, so a placeholder URL is enough there. At runtime a missing URL still
 * throws, so a misconfigured deployment fails at once instead of at a request.
 */
const BUILD_PLACEHOLDER_URL = "postgres://build:build@localhost:5432/build"
const isBuildPhase = process.env.NEXT_PHASE === "phase-production-build"

const connectionString =
  process.env.DATABASE_URL ?? (isBuildPhase ? BUILD_PLACEHOLDER_URL : undefined)

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
