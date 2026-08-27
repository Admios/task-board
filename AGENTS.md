# AGENTS.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Requires Node.js 26+ (`.nvmrc` pins this). `node:sqlite`, the built-in module this app uses as its database, is stable as of Node 26.

```bash
npm install                                   # install dependencies
npm run db:migrate                            # apply db/schema.sql to the dev SQLite database
npm run dev                                   # start dev server at localhost:3000

npm test                                      # run all Jest unit tests
npx jest path/to/File.test.ts                 # run a single test file
npx jest -t "test name"                       # run tests matching a name

npm run lint                                  # eslint (flat config, eslint-config-next core-web-vitals)
npm run build                                 # next build
```

End-to-end tests (Cypress) require the dev server running against a separate test database:

```bash
npm run db:migrate-test
npm run dev:test        # in one terminal
npm run test:e2e        # in another (wraps `cy:run`); `npm run cy:open` for interactive mode
```

Database utility scripts: `npm run db:seed` (generates demo tasks for existing users), `npm run db:clear` (empties tables).

CI (`.github/workflows/node.js.yml`) runs `npm ci`, `npm run lint`, `npm test` on Node 26.

## Architecture

Task Board is a monolithic Next.js (App Router) application: a single process with an embedded SQLite database file — no separate database process. Path alias `@/*` maps to `./src/*`.

### Layer structure

- **`src/app`** — Next.js App Router routes only (`page.tsx`, `layout.tsx`). Route files are thin: they read cookies/params, fetch data via repositories, and hand off to a template component. Route pages are `"use server"`.
- **`src/templates`** — the actual page implementations (e.g. `KanbanBoard`, `BoardList`, `Login`), one directory per page. Named "templates" instead of "pages" because "pages" is reserved by the old Next.js router, which this project does not use.
- **`src/model`** — one directory per entity (`Board`, `Task`, `State`, `User`, `Authenticator`, `AuthenticationChallenge`), each with a `*DTO.ts` (data shape) and a `*Repository.ts` (data access, extends `BaseRepository`).
- **`src/authentication`** — WebAuthn/Passkey helpers used by server actions.
- **`src/scripts`** — standalone scripts run via `tsx` (migrate, seed, clear) — see `db:*` npm scripts.

### Server/client boundary

Data flows from SQLite to the browser through explicit Next.js directives, not a REST/GraphQL API:

- Files starting with `"use server"` run only on the server. Route pages (`src/app/**/page.tsx`) fetch data here via repositories and pass it down as React props to a template.
- Mutations from the frontend (e.g. `src/templates/KanbanBoard/kanbanActions.ts`) are Server Actions — also `"use server"` — invoked directly from client components as if they were local async functions.
- Files starting with `"use client"` are interactive components that receive server-fetched data as props and manage their own local/UI state.

### Data access (SQLite)

All repositories extend `BaseRepository<T, TRow>` (`src/model/BaseRepository.ts`), which wraps a process-wide `node:sqlite` `DatabaseSync` singleton (`src/model/SqliteClient.ts`) and provides `findById`, `list`, `create`, `update`, `upsert`, `delete`. `node:sqlite` is fully synchronous, so the whole repository API is synchronous — no `async`/`Promise` anywhere in `BaseRepository`. A subclass declares its identity as plain `abstract readonly` class fields — no constructor needed unless the repository has other setup to do:

```ts
export class BoardRepository extends BaseRepository<BoardDTO> {
  readonly tableName = "boards";
  readonly entityName = "Board";
  readonly columns = defineColumns<BoardDTO>({ id: true, name: true, owner: true });

  listByUserId(userId: string) {
    return this.query(`SELECT * FROM "${this.tableName}" WHERE "owner" = ?`, userId);
  }
}
```

`defineColumns<T>()` (`src/model/columns.ts`) takes an object literal with one `true` per DTO field and returns the column list — TypeScript rejects it at compile time if a field is missing or misspelled, so a repository's column list can't silently drift from its DTO. Column names are identical to DTO property names (e.g. `stateId`, `credentialPublicKey`), so there's no snake_case↔camelCase mapping layer. `idColumn` defaults to `"id"`; override it the same way (`override readonly idColumn = "email";` in `UserRepository`) when the primary key is named differently. Add custom queries with `this.query(sql, ...params)` (see `BoardRepository.listByUserId`). Repositories re-`prepare()` a given SQL string only once (cached per instance), not on every call.

The second generic parameter, `TRow`, is the literal shape actually stored in/read from SQLite; it defaults to `Record<string, SqlValue>` and only needs naming when a repository's `toRow`/`fromRow` do real value conversion. `AuthenticatorRepository` is the one repository that does: it declares its own `AuthenticatorRow` interface and extends `BaseRepository<AuthenticatorDTO, AuthenticatorRow>`, so `toRow`/`fromRow` convert `credentialBackedUp` to/from `0`/`1`, `credentialPublicKey` to/from a `Uint8Array`, and `transports` to/from a CSV string against properly typed fields instead of casting each one out of an untyped row.

`create`, `update`, and `upsert` are three distinct operations, not interchangeable: `create` INSERTs and throws if the id already exists; `update` UPDATEs by `idColumn` and throws if no row matched; `upsert` does either silently, and is a *last resort* for callers that genuinely can't know in advance which case applies (the only one in this codebase is the passkey-challenge write in `authentication/index.ts#generateOptions`, which fires for both new and returning users). Prefer `create`/`update` everywhere else — they turn a double-insert or an update-after-delete into a thrown error instead of a silent overwrite.

Table schema changes go in the single idempotent `db/schema.sql`, applied via `npm run db:migrate` (`src/scripts/migrate.ts`).

Multi-row writes that must be atomic (e.g. registering a user + authenticator together, or creating a board + its default states) run inside `transaction(fn)` from `SqliteClient.ts`, calling the repositories' normal (synchronous) methods — `kanbanActions.ts#moveTaskDB` wraps its whole reorder fan-out this way too, which Cassandra's lack of cross-partition transactions never allowed. Foreign keys are enforced (`PRAGMA foreign_keys = ON`, set on every connection in `SqliteClient.ts` since the pragma is per-connection and not persisted), so writes inside a `transaction()` must insert the parent row before the child row (e.g. user before authenticator, board before states) or the insert will fail immediately — SQLite checks foreign keys immediately, not deferred. One table is deliberately unconstrained: `authentication_challenges` has no foreign key to `users`, because a passkey challenge is written before the user exists.

### Kanban board client state

`src/templates/KanbanBoard/model` holds a Zustand store (`state.ts` defines `KanbanState`/`KanbanActions`; `index.ts` wires the store) that is the client-side source of truth for the currently open board: task/state ordering, task and state entities, current user, and current board id. It's initialized from server-fetched DTOs (`initialize(initialTasks, initialStates)`) and updated via actions like `addTask`, `moveTask`, `editTask`, `deleteTask` as the user interacts with drag-and-drop (`react-dnd`) columns. `kanbanActions.ts` in the same template directory bridges these client-side mutations to the `"use server"` Server Actions that persist them.

### Authentication: Passkeys via WebAuthn

No passwords — login uses `@simplewebauthn/browser` + `@simplewebauthn/server` (v13; `@simplewebauthn/types` is deprecated and no longer a dependency — import types directly from `@simplewebauthn/server`/`@simplewebauthn/browser`). Flow:

1. User submits username/email on `/login`; a Server Action returns a WebAuthn challenge, persisted as an `AuthenticationChallenge` (new users may use any authenticator, existing users are restricted to enrolled ones).
2. The client signs the challenge via a biometric/FIDO2 device using `simplewebauthn`.
3. A Server Action verifies the signed challenge against the stored `AuthenticationChallenge`; on success it deletes the challenge, and — for new users — creates the `User` and `Authenticator` records.
4. On success the server sets an HTTP-only `userId` cookie, which route pages (e.g. `src/app/page.tsx`) read to resolve the current user server-side.

Known client support gaps: Firefox doesn't support TouchID (FIDO2 device works everywhere); the 1Password browser plugin isn't supported yet.

v13 API shapes worth knowing before touching this code:
- `startRegistration`/`startAuthentication` (browser) take `{ optionsJSON }`, not the options object directly.
- `verifyAuthenticationResponse` (server) takes `credential: { id, publicKey, counter, transports }`, not the old flat `authenticator` param.
- `verifyRegistrationResponse`'s result nests credential data under `registrationInfo.credential.{id,publicKey,counter}` instead of flat `registrationInfo.credentialID`/`credentialPublicKey`/`counter` fields — see `AuthenticatorRepository.fromRegistration`.
- `AuthenticatorDTO.credentialPublicKey` is typed `Uint8Array_` (from `@simplewebauthn/server`), not bare `Uint8Array` — needed because the library's buffers are `Uint8Array<ArrayBuffer>` specifically under current TS/lib.dom typings.

### Styling

Bulma (SASS-based CSS framework, compiled to static CSS) provides base UI components; component-specific styling is added via CSS Modules (`*.module.css`) alongside components.
