# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Requires Node.js and Docker Desktop. Node 23.0.0 is known to break migrations — use 22.x if `db:migrate` fails.

```bash
npm install                                   # install dependencies
docker compose -f docker/dev.compose.yml up -d # start local Cassandra
npm run db:keyspace:create                    # create dev keyspace (retry after ~1 min if it fails; Cassandra needs time to boot)
npm run db:migrate                            # run migrations (cassandra-migration)
npm run dev                                   # start dev server at localhost:3000

npm test                                      # run all Jest unit tests
npx jest path/to/File.test.ts                 # run a single test file
npx jest -t "test name"                       # run tests matching a name

npm run lint                                  # eslint (flat config, eslint-config-next core-web-vitals)
npm run build                                 # next build
```

End-to-end tests (Cypress) require the dev server running against a separate test keyspace:

```bash
npm run db:keyspace:create-test
npm run db:migrate-test
npm run dev:test        # in one terminal
npm run test:e2e        # in another (wraps `cy:run`); `npm run cy:open` for interactive mode
```

Database utility scripts: `npm run db:seed` (generates demo tasks for existing users), `npm run db:clear` (empties tables).

CI (`.github/workflows/node.js.yml`) runs `npm ci`, `npm run lint`, `npm test` on Node 24.

## Architecture

Task Board is a monolithic Next.js (App Router) application: one web server process plus an Apache Cassandra database. Path alias `@/*` maps to `./src/*`.

### Layer structure

- **`src/app`** — Next.js App Router routes only (`page.tsx`, `layout.tsx`). Route files are thin: they read cookies/params, fetch data via repositories, and hand off to a template component. Route pages are `"use server"`.
- **`src/templates`** — the actual page implementations (e.g. `KanbanBoard`, `BoardList`, `Login`), one directory per page. Named "templates" instead of "pages" because "pages" is reserved by the old Next.js router, which this project does not use.
- **`src/model`** — one directory per entity (`Board`, `Task`, `State`, `User`, `Authenticator`, `AuthenticationChallenge`), each with a `*DTO.ts` (data shape) and a `*Repository.ts` (data access, extends `BaseRepository`).
- **`src/authentication`** — WebAuthn/Passkey helpers used by server actions.
- **`src/scripts`** — standalone scripts run via `tsx` (keyspace creation, seed, clear) — see `db:*` npm scripts.

### Server/client boundary

Data flows from Cassandra to the browser through explicit Next.js directives, not a REST/GraphQL API:

- Files starting with `"use server"` run only on the server. Route pages (`src/app/**/page.tsx`) fetch data here via repositories and pass it down as React props to a template.
- Mutations from the frontend (e.g. `src/templates/KanbanBoard/kanbanActions.ts`) are Server Actions — also `"use server"` — invoked directly from client components as if they were local async functions.
- Files starting with `"use client"` are interactive components that receive server-fetched data as props and manage their own local/UI state.

### Data access (Cassandra)

All repositories extend `BaseRepository<T>` (`src/model/BaseRepository.ts`), which wraps the `cassandra-driver` mapper (`src/model/CassandraClient.ts`) and provides `findById`, `list`, `create`, `update`, `delete`. Subclasses declare `tableName`/`entityName` and add custom mapped queries via `this.mapper.mapWithQuery(...)` (see `BoardRepository.queryByOwner` for the pattern). Table schema changes go through `migrations/` and `cassandra-migration`.

### Kanban board client state

`src/templates/KanbanBoard/model` holds a Zustand store (`state.ts` defines `KanbanState`/`KanbanActions`; `index.ts` wires the store) that is the client-side source of truth for the currently open board: task/state ordering, task and state entities, current user, and current board id. It's initialized from server-fetched DTOs (`initialize(initialTasks, initialStates)`) and updated via actions like `addTask`, `moveTask`, `editTask`, `deleteTask` as the user interacts with drag-and-drop (`react-dnd`) columns. `kanbanActions.ts` in the same template directory bridges these client-side mutations to the `"use server"` Server Actions that persist them.

### Authentication: Passkeys via WebAuthn

No passwords — login uses `@simplewebauthn/browser` + `@simplewebauthn/server`. Flow:

1. User submits username/email on `/login`; a Server Action returns a WebAuthn challenge, persisted as an `AuthenticationChallenge` (new users may use any authenticator, existing users are restricted to enrolled ones).
2. The client signs the challenge via a biometric/FIDO2 device using `simplewebauthn`.
3. A Server Action verifies the signed challenge against the stored `AuthenticationChallenge`; on success it deletes the challenge, and — for new users — creates the `User` and `Authenticator` records.
4. On success the server sets an HTTP-only `userId` cookie, which route pages (e.g. `src/app/page.tsx`) read to resolve the current user server-side.

Known client support gaps: Firefox doesn't support TouchID (FIDO2 device works everywhere); the 1Password browser plugin isn't supported yet.

### Styling

Bulma (SASS-based CSS framework, compiled to static CSS) provides base UI components; component-specific styling is added via CSS Modules (`*.module.css`) alongside components.
