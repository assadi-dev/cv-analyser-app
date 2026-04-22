# Job Optimizer App

AI-powered personal job application tracker — Next.js 15 frontend.

## Stack
- **Next.js 16** (App Router + Turbopack + **React Compiler stable**)
- **React 19**
- **TypeScript** (strict mode)
- **Tailwind CSS v4** with custom `@theme` design tokens
- **better-auth** for authentication (email + Google + LinkedIn)
- **Zustand** for global state
- **Jest + Testing Library** for unit tests

## React Compiler

Next.js 16 includes stable React Compiler support (`reactCompiler: true` in `next.config.ts`).

**What this means:**
- Components are automatically memoized — no need for `React.memo`
- Functions are automatically stable — no need for `useCallback`
- Values are automatically cached — no need for `useMemo`
- Next.js uses SWC analysis to only compile relevant files (faster builds)

> ⚠️ Expect slightly longer build times vs Next.js 15 due to Babel compilation.

## Setup

```bash
# Install dependencies
npm install

# Copy and configure environment
cp .env.local.example .env.local

# Generate Drizzle migrations from schema
npm run db:generate

# Apply migrations to PostgreSQL
npm run db:migrate

# Start dev server
npm run dev
```

## Database (Drizzle)

```bash
npm run db:generate   # Generate SQL migrations from schema changes
npm run db:migrate    # Apply pending migrations
npm run db:push       # Push schema directly (dev only — no migration files)
npm run db:studio     # Open Drizzle Studio (visual DB browser)
```

## Run tests
```bash
npm test
npm run test:coverage
```

## Project structure

```
src/
├── app/
│   ├── (auth)/login/      # Login page
│   ├── (dashboard)/       # Protected pages with sidebar
│   │   ├── analyser/      # CV analysis + SSE streaming
│   │   ├── dashboard/     # Kanban board
│   │   ├── candidatures/  # Table view
│   │   └── parametres/    # Settings
│   ├── api/auth/          # better-auth handler
│   └── globals.css        # Tailwind v4 @theme tokens
├── components/
│   ├── ui/                # Button, Input, Badge, Switch, Card, Modal
│   └── layout/            # Sidebar, Topbar
├── hooks/
│   └── useSSE.ts          # SSE streaming hook
├── lib/
│   ├── api.ts             # FastAPI client with JWT
│   ├── auth.ts            # better-auth server config
│   └── auth-client.ts     # better-auth client
├── store/
│   └── analyse.store.ts   # Zustand analysis state
└── types/
    └── index.ts           # All TypeScript types
```
