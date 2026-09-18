# AIJobResearcher Frontend

**Status:** active
**Date:** 2026-09-18
**Version:** 2.0

User interface of AIJobResearcher: a Next.js 16.3 App Router application over
the Vacancies Market REST API. This file documents the stack, structure,
commands and known gaps of this repository only. Contract and page details
live in `docs/` (an untracked mirror of the platform documentation
repository).

## 1. Stack

- **1.1** React 19.2 with Next.js 16.3.5 App Router and TypeScript 7.0.2; the
  React Compiler is enabled (`babel-plugin-react-compiler`).
- **1.2** Server state lives in TanStack Query v5; local UI state lives in
  React hooks. There is no global Redux/Context/Zustand store (ADR-019).
- **1.3** Styling is Tailwind CSS v4 through `@tailwindcss/postcss` with the
  self-hosted Inter font from `next/font`.
- **1.4** Backend calls use an `openapi-fetch` client over types generated
  from the OpenAPI spec; there is no BFF (ADR-019).
- **1.5** UI strings are `next-intl` keys with the English locale active
  (ADR-019 Localisation).
- **1.6** Linting is oxlint, tests are Jest with React Testing Library.
- **1.7** Dependency versions are pinned exactly and locked by
  `package-lock.json` (react-standards.md 7.3).

## 2. Structure

- **2.1** `app/` — App Router routes, layout and providers; route-only
  components live in `app/_components/`.
- **2.2** `src/shared/` — cross-cutting code: `api/` (typed client, error
  model, `Correlation-ID`, generated OpenAPI types), `config/`, `i18n/`,
  `lib/`, `ui/`, `test-utils/`.
- **2.3** `src/entities/` — `vacancy/` and `desired-job/`, each with its
  `api/`, `model/` (hooks and cache keys) and `ui/`.
- **2.4** `src/features/` — `vacancies-market/` page composition and its view
  model.
- **2.5** Imports go downward only: `app/` → `features/` → `entities/` →
  `shared/` (react-standards.md 8.5). `src/pages/` is not used, because
  Next.js treats it as the Pages Router.
- **2.6** `src/__tests__/` mirrors the layers; `_cache/` holds npm and tool
  caches (git-ignored); `.ai-agent/` holds agent standards and scratch;
  `docs/` is a read-only documentation mirror.

## 3. Commands

- **3.1** `npm run dev` — Next dev server on port 3005.
- **3.2** `npm run build` / `npm start` — production build and server.
- **3.3** `npm run type-check`, `npm run lint:check`, `npm run format:check`,
  `npm run test:run` — individual gates.
- **3.4** `npm run verify` — scoped gate: types, lint and related tests on the
  changed files.
- **3.5** `npm run api:types` — regenerate the contract types. TypeScript 7
  has no JS compiler API, so code generation runs in an isolated TypeScript
  5.9.3 sandbox through `npx`.

## 4. Environment

- **4.1** `NEXT_PUBLIC_VACANCIES_MARKET_API_URL` is inlined into the client
  bundle.
- **4.2** Copy `.env.example` to `.env.local` and adjust; `.env.local` is
  git-ignored.
- **4.3** A missing variable falls back to the documented dev URL.

## 5. Contracts

- **5.1** `docs/api/*/openapi.yaml` is the source of truth for payloads; a
  contract change regenerates `src/shared/api/generated/` in the same change
  (react-standards.md 6.1).
- **5.2** `docs/ui/*` holds the page and flow specifications the UI follows.
- **5.3** `docs/` is synced from an external repository by
  `scripts/sync-docs.mjs`; report code/spec mismatches instead of editing it.

## 6. Quality gates

- **6.1** `.github/workflows/ci.yml` runs type-check, lint, tests and build.
- **6.2** Husky runs `lint:check` before a commit and `type-check` before a
  push; lint-staged formats staged files.
- **6.3** Components target WCAG 2.1 AA: keyboard access, visible focus,
  labels and ARIA (docs/technical-requirements.md 1.5).

## 7. Open questions

Open items are tracked only in `.ai-agent/user.data/temp/todo.md` (local
scratch) and are not duplicated here.
