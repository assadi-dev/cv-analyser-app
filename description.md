# Job Optimizer App

> Tracker de candidatures intelligent, propulsé par l'IA — optimisez vos candidatures et suivez l'ensemble de votre recherche d'emploi depuis une interface unique.

![Status](https://img.shields.io/badge/status-en%20développement-blue)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6)

---

## Présentation

**Job Optimizer App** est une application web full-stack qui aide les candidats à maximiser
l'efficacité de leur recherche d'emploi. L'application analyse un CV face à une offre d'emploi
grâce à l'intelligence artificielle, calcule un score de compatibilité ATS, identifie les
mots-clés manquants et génère des recommandations concrètes d'amélioration — le tout en
**temps réel** via streaming.

En complément, elle offre un **suivi complet des candidatures** (vue Kanban + vue tableau),
des statistiques de progression et une gestion centralisée des CV et contacts.

---

## Fonctionnalités clés

### Analyse de CV par IA (temps réel)
- Upload d'un CV (PDF) + saisie d'une offre d'emploi
- Analyse en **streaming SSE** (Server-Sent Events) avec progression étape par étape :
  `parsing → ATS → scoring → recommandations`
- Scores détaillés : **score global**, **score ATS**, **compétences**, **expérience**
- Détection des **mots-clés trouvés / manquants**
- **Recommandations priorisées** par niveau d'impact (high / medium / low)
- Support multi-fournisseurs IA : **OpenAI, Anthropic, Groq, Mistral, OpenRouter, Ollama**

### Suivi des candidatures
- **Vue Kanban** : tableau de bord par statut (à envoyer, envoyée, entretien, refusée, acceptée)
- **Vue Tableau** : table avancée avec tri, filtres, recherche et pagination (TanStack Table)
- Gestion CRUD complète avec **optimistic updates** et feedback toast
- Gestion des contacts (email / téléphone) par candidature
- Types de contrat (CDI, CDD, Freelance, Stage, Alternance) et modes de travail (remote, hybride, présentiel)

### Tableau de bord & statistiques
- Cartes de statistiques agrégées sur l'ensemble des candidatures
- Suivi de la progression de la recherche d'emploi

### Authentification & paramètres
- Authentification via **better-auth** : email/mot de passe + OAuth (Google, LinkedIn)
- Page de paramètres : choix du fournisseur et du modèle IA, langue, seuil ATS, niveau de détail des recommandations

---

## Stack technique

### Frontend
| Domaine | Technologie |
|---|---|
| Framework | **Next.js 16** (App Router, Turbopack, **React Compiler stable**) |
| UI | **React 19**, **TypeScript** (mode strict) |
| Styling | **Tailwind CSS v4** avec design tokens `@theme`, `shadcn/ui`, Radix UI |
| Data fetching | **TanStack Query** (useQuery / useMutation / optimistic updates) |
| Tables | **TanStack Table** |
| État global | **Zustand** |
| Formulaires | **react-hook-form** + **Zod** |
| URL state | **nuqs** (query params synchronisés) |
| Notifications | **Sonner** (toasts) |
| Icônes | **lucide-react** |

### Backend & données
| Domaine | Technologie |
|---|---|
| API Routes | **Next.js Route Handlers** (proxy vers une API externe FastAPI) |
| ORM | **Drizzle ORM** + **PostgreSQL** (`postgres`) |
| Auth | **better-auth** (adapter Drizzle) |
| Streaming | **Server-Sent Events** (SSE) |
| Validation | **Zod** côté serveur |

### Qualité & outillage
| Domaine | Technologie |
|---|---|
| Tests | **Vitest** + **Testing Library** + **jsdom** |
| Lint | **ESLint** (config Next.js) |
| Migrations | **drizzle-kit** |

---

## Architecture

Le projet suit une **architecture modulaire orientée SOLID**, où chaque page encapsule
ses propres composants, hooks, API et types au plus près de leur contexte fonctionnel.

```
src/
├── app/
│   ├── (auth)/                      # Login / Register (route group)
│   ├── (dashboard)/                 # Pages protégées avec layout sidebar
│   │   ├── analyser/                # Analyse CV + streaming SSE
│   │   ├── dashboard/               # Vue Kanban + statistiques
│   │   │   ├── _api/                # Query keys + fetch functions
│   │   │   ├── _components/         # KanbanBoard, StatsSection…
│   │   │   ├── _hooks/              # useCandidatures, useDashboardStats
│   │   │   ├── _lib/                # config métier (kanban.config.ts)
│   │   │   └── _types/
│   │   ├── candidatures/            # Vue tableau (TanStack Table)
│   │   │   ├── _components/
│   │   │   │   ├── CandidaturesTable/   # Table, pagination, skeleton…
│   │   │   │   ├── FilterBar/           # Recherche + filtres
│   │   │   │   ├── StatusTabs/          # Onglets par statut
│   │   │   │   ├── forms/               # AddCandidatureForm (sections)
│   │   │   │   └── modals/              # Add / Delete confirm
│   │   │   ├── _hooks/              # useCandidatures, useAddCandidature…
│   │   │   ├── _lib/                # schémas Zod, colonnes, config
│   │   │   └── _types/
│   │   └── parametres/             # Paramètres utilisateur
│   └── api/                        # Route handlers (proxy FastAPI)
│       ├── (accounts)/me/
│       ├── (candidatures)/
│       ├── (cvs)/
│       ├── (preferences)/
│       ├── analyse/[id]/
│       ├── auth/[...all]/          # better-auth handler
│       └── ia/analyse-stream/     # endpoint SSE de streaming
├── components/
│   ├── ui/                         # Button, Input, Badge, Modal, Card… (shadcn)
│   ├── layout/                     # Sidebar, Topbar
│   └── providers/                  # QueryProvider (TanStack Query)
├── hooks/                          # Hooks partagés (useSSE, useModal, useToast)
├── lib/                            # api, auth, logger, schemas, security, utils
├── store/                          # Zustand (analyse.store.ts)
├── db/                             # Drizzle schema + migrations
└── types/                          # Types TypeScript partagés
```

### Principes appliqués
- **Séparation des responsabilités** : UI / logique métier / accès données isolés
- **Hooks custom** pour toute logique (data fetching, état, effets, transformations)
- **Server Components** par défaut ; un seul wrapper `"use client"` par page
- **Optimistic updates** systématiques sur les mutations (rollback + toast)
- **Logger** centralisé actif uniquement en développement
- **Validation Zod** sur les entrées serveur et les formulaires

---

## Choix techniques notables

- **React Compiler stable (Next.js 16)** : mémoïsation automatique des composants —
  suppression de `React.memo`, `useCallback`, `useMemo` superflus.
- **Architecture hybride** : le frontend Next.js sert d'orchestrateur et de proxy
  authentifié (JWT) vers une **API externe FastAPI/SQLAlchemy** qui gère le métier IA.
  Drizzle gère côté Next.js uniquement les tables d'authentification (`user`, `session`,
  `account`, `verification`).
- **Streaming SSE** pour une UX réactive pendant les traitements IA longs.
- **Conventions strictes** (CLAUDE.md) garantissant cohérence et scalabilité sur
  toutes les pages.

---

## Démarrage

```bash
# Installer les dépendances
npm install

# Configurer l'environnement
cp .env.local.example .env.local

# Générer et appliquer les migrations Drizzle
npm run db:generate
npm run db:migrate

# Lancer le serveur de développement
npm run dev
```

### Scripts utiles
```bash
npm run dev            # Serveur de dev (Turbopack)
npm run build          # Build de production
npm run type-check     # Vérification TypeScript
npm test               # Tests unitaires (Vitest)
npm run test:coverage  # Couverture de tests
npm run db:studio      # Explorateur de base de données Drizzle
```

---

## Compétences démontrées

- Conception d'une **architecture front-end modulaire et scalable** (principes SOLID)
- Maîtrise de l'**écosystème React moderne** (React 19, Server Components, React Compiler)
- Intégration **IA en temps réel** via streaming SSE et fournisseurs multiples
- Gestion d'état avancée (**TanStack Query**, optimistic updates, **Zustand**, **nuqs**)
- **Authentification** sécurisée (better-auth, OAuth, JWT)
- Modélisation de données et migrations (**Drizzle ORM** + PostgreSQL)
- Construction d'interfaces complexes (**Kanban**, **tables de données** triables/filtrables)
- **TypeScript strict**, validation **Zod**, tests **Vitest / Testing Library**
