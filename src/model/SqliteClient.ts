import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";

/** The value types `node:sqlite` accepts as bound parameters. */
export type SqlValue = null | number | bigint | string | Uint8Array;

function createDatabase(): DatabaseSync {
  const configured = process.env.SQLITE_PATH ?? "./data/tasks.db";
  let database: DatabaseSync;

  if (configured === ":memory:") {
    database = new DatabaseSync(":memory:");
  } else {
    // SQLITE_PATH is intentionally runtime-configurable (dev vs. test DB
    // file), so this can't be statically scoped to a literal subfolder.
    // Suppress Turbopack's "traces the whole project" warning rather than
    // bundling every source file as a false-positive dependency.
    const resolved = path.resolve(/* turbopackIgnore: true */ configured);
    fs.mkdirSync(path.dirname(resolved), { recursive: true });
    database = new DatabaseSync(resolved);
    database.exec("PRAGMA journal_mode = WAL");
    database.exec("PRAGMA busy_timeout = 5000");
  }

  // Per-connection and NOT persisted in the file — without this the foreign
  // keys in db/schema.sql are silently ignored. Must apply to :memory: too,
  // or the tests would run with constraints the real app enforces.
  database.exec("PRAGMA foreign_keys = ON");
  return database;
}

// Next.js dev-mode HMR re-evaluates modules; keep one handle per process.
const globalForDb = globalThis as unknown as { __taskBoardDb?: DatabaseSync };

function getDb(): DatabaseSync {
  return (globalForDb.__taskBoardDb ??= createDatabase());
}

/**
 * A lazily-initialized handle to the singleton `DatabaseSync` connection.
 *
 * This must NOT open the database file just by being imported: Next.js's
 * production build imports every route module (transitively, through
 * BaseRepository) from several worker processes during page-data
 * collection, and those workers would otherwise race to open/create the
 * same SQLite file at once, throwing "database is locked". Routing every
 * access through this Proxy defers the real `createDatabase()` call until
 * the first actual property access (e.g. `.prepare`, `.exec`), which only
 * happens once a repository method actually runs.
 */
export const db: DatabaseSync = new Proxy({} as DatabaseSync, {
  get(_target, prop) {
    const instance = getDb();
    const value = Reflect.get(instance, prop, instance);
    return typeof value === "function" ? value.bind(instance) : value;
  },
});

/**
 * Runs `fn` inside a SQLite transaction. `node:sqlite` is synchronous, so the
 * callback must be synchronous too — use the repositories' `*Sync` methods.
 * Replaces `mapper.batch(...)`.
 */
export function transaction<T>(fn: () => T): T {
  db.exec("BEGIN");
  try {
    const result = fn();
    db.exec("COMMIT");
    return result;
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}
