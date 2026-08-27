import fs from "node:fs";
import path from "node:path";
import type { DatabaseSync } from "node:sqlite";

/**
 * Child-before-parent order. `clearAllTables` deletes in this order so the
 * foreign keys in db/schema.sql are never violated mid-wipe.
 */
export const TABLE_NAMES = [
  "tasks",
  "states",
  "boards",
  "authenticators",
  "authentication_challenges",
  "users",
] as const;

export function applySchema(database: DatabaseSync): void {
  const sql = fs.readFileSync(
    path.resolve(process.cwd(), "db/schema.sql"),
    "utf8",
  );
  database.exec(sql);
}

export function clearAllTables(database: DatabaseSync): void {
  for (const table of TABLE_NAMES) {
    database.exec(`DELETE FROM "${table}"`);
  }
}
