# AIJobResearcher Frontend — Agent Instructions

## 1. Project

User interface of AIJobResearcher: a single-page React + TypeScript
application built with Webpack 5 and Babel.

1. `src/` — application code: `api/`, `components/`, `hooks/`, `pages/`,
   `schemas/`, `store/`, `types/`, `utils/`, `__tests__/`; entry point
   `src/main.tsx`.
2. `docs/` — untracked copy of the platform documentation (ADR, domain, C4,
   OpenAPI, AsyncAPI); reference only, not part of this repository's history.
3. `.ai-agent/` — agent standards and untracked scratch space (`user.data/`,
   `agent.data/`).
4. Configs — `package.json`, `webpack.config.ts`, `vitest.config.ts`,
   `eslint.config.mjs`, `tsconfig.json`, `.husky/`.
5. Integration — REST consumer of Vacancies Market and ResearcherCrm; domain
   events do not involve this service.

## 2. Quality

1. Before editing a file, load and strictly obey its standard: `.ts`/`.tsx` →
   `.ai-agent/standards/react-standards.md`; Markdown or agent files →
   `.ai-agent/standards/md-files-standards.md`; `docs/` content →
   `.ai-agent/standards/docs-files-standards.md`; other formats mirror the
   edited file's style.
2. `docs/api/*/openapi.yaml` is the source of truth for request and response
   shapes; when code and spec disagree, report the mismatch instead of
   hardcoding either of them.
3. Keep layers apart: server state and transport in `src/api/` and
   `src/hooks/`, UI state in `src/store/`, runtime validation in
   `src/schemas/`; components stay free of business logic.
4. Change only what the task requires: patch the affected section, no
   speculative rewrites or extra artifacts.
5. Prefer the scoped check `npm run verify` (types + lint + related tests on
   changed files) when checking is requested (see 5.4).

## 3. Token Efficiency

1. Never read `package-lock.json`, `node_modules/`, `dist/`, `coverage/`;
   take scripts and versions from `package.json`.
2. Grep first, then read matching ranges only and cite `path#L..L`; inside
   `docs/` and `docs/api/*/openapi.yaml` read the one section or operation,
   never the whole file; cap shell output with `head`/`tail`/`grep`.
3. Reuse values already read; never repeat a grep, read, build, or test.
4. Keep temp artifacts under `.ai-agent/agent.data`, each <40 lines; after
   ~20 messages or a large context, suggest a fresh session.
5. Before acting, restate the task in one line and name the affected files (in
   order); ask at most once, in one block, only for material missing inputs,
   otherwise apply the defaults here and mark ASSUMPTION.
6. Report as one short line — "Done — `<files>`" — plus diff hunks only; no
   rationale, step summaries, or interim reports unless asked.

## 4. Definition of done

1. Fully deliver the requested scope; stop only when genuinely blocked (see
   3.5).
2. Code is done when it satisfies 2.2–2.4 and stays clean under strict
   TypeScript by construction.
3. State what remains unverified instead of running checks to prove
   completion (see 5.4).

## 5. Limitations

1. Scope: this repository only.
2. Git (stage/commit/push) is handled by the user.
3. Ask first before adding dependencies, changing the project configs (see
   1.4), restructuring, or deleting/overwriting files.
4. Never run analyzers, tests, or installs on your own (ESLint, Prettier,
   `tsc`, Vitest, npm install); run them only on an explicit "run" / "fix and
   verify" request, scoped to the changed files, then re-report briefly. A
   pasted error list means: fix exactly that and stop — no tool runs, no
   extra checks.
5. Never put secrets, credentials, or real tokens in files or output; reference
   `.env` variables by name only (`.env.local` is untracked).
