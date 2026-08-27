import type { StatementSync } from "node:sqlite";
import { db, SqlValue } from "./SqliteClient";

/**
 * Base for all SQLite-backed repositories. `node:sqlite` is fully
 * synchronous, so every method here is too — there's no I/O to await.
 *
 * `create`/`update`/`upsert` are three distinct operations, not one:
 *  - `create` INSERTs; it throws if `idColumn` already exists.
 *  - `update` UPDATEs by `idColumn`; it throws if no row matched.
 *  - `upsert` does either, silently. Reach for it only when the caller
 *    genuinely doesn't know ahead of time whether the row exists yet.
 *    Everywhere else, `create`/`update` catch real bugs (double-inserts,
 *    updates racing a delete) that a blanket upsert would hide.
 */
export abstract class BaseRepository<
  T extends Record<string, any>,
  /**
   * The literal shape actually stored in/read from SQLite. Defaults to the
   * fully generic `Record<string, SqlValue>` — override it (see
   * `AuthenticatorRepository`) when `toRow`/`fromRow` need named, typed
   * fields instead of casting each one individually. The one cast this
   * can't remove is `query()`'s `as TRow[]` below: something has to assert
   * that the driver's untyped output matches what the repository declares.
   */
  TRow extends Record<string, SqlValue> = Record<string, SqlValue>,
> {
  abstract readonly tableName: string;
  abstract readonly entityName: string;
  /** Every column, matching the DTO's property names. Build with `defineColumns`. */
  abstract readonly columns: readonly (keyof T & string)[];
  /** Primary-key column. Redeclare this field to override (see `UserRepository`). */
  readonly idColumn: keyof T & string = "id" as keyof T & string;

  private readonly statementCache = new Map<string, StatementSync>();

  /** DTO -> row. Override to convert values SQLite can't bind directly (BLOBs, booleans, CSV, ...). */
  protected toRow(entity: T): TRow {
    return entity as unknown as TRow;
  }

  /**
   * Row -> DTO. Override alongside `toRow` (and `TRow`) for the same
   * conversions, in reverse. The spread is required, not cosmetic:
   * `node:sqlite` returns rows as null-prototype objects, which React
   * rejects when a Server Component passes them as props to a Client
   * Component ("Only plain objects ... can be passed to Client Components").
   */
  protected fromRow(row: TRow): T {
    return { ...row } as unknown as T;
  }

  /** Compiles `sql` once per repository instance, then reuses the prepared statement. */
  private prepare(sql: string): StatementSync {
    let statement = this.statementCache.get(sql);
    if (!statement) {
      statement = db.prepare(sql);
      this.statementCache.set(sql, statement);
    }
    return statement;
  }

  protected query(sql: string, ...params: SqlValue[]): T[] {
    // The one unavoidable cast: node:sqlite's driver output is untyped, so
    // something has to assert it matches the row shape this repository
    // declares. Every other cast in a subclass's toRow/fromRow follows from
    // this one and can be removed by typing TRow precisely (see
    // AuthenticatorRepository).
    const rows = this.prepare(sql).all(...params) as TRow[];
    return rows.map((row) => this.fromRow(row));
  }

  findById(id: string): T {
    const [row] = this.query(
      `SELECT * FROM "${this.tableName}" WHERE "${this.idColumn}" = ?`,
      id,
    );
    if (!row) {
      throw new Error(`${this.entityName} not found`);
    }
    return row;
  }

  list(): T[] {
    return this.query(`SELECT * FROM "${this.tableName}"`);
  }

  /** Inserts a new row. Throws (SQLite `UNIQUE constraint failed`) if `idColumn` already exists. */
  create(input: T): T {
    const row = this.toRow(input);
    const quoted = this.columns.map((c) => `"${c}"`).join(", ");
    const placeholders = this.columns.map(() => "?").join(", ");
    const sql = `INSERT INTO "${this.tableName}" (${quoted}) VALUES (${placeholders})`;
    this.prepare(sql).run(...this.columns.map((c) => row[c] ?? null));
    return input;
  }

  /** Updates an existing row by `idColumn`. Throws if no row matched. */
  update(input: T): T {
    const row = this.toRow(input);
    const updatable = this.columns.filter((c) => c !== this.idColumn);
    if (updatable.length === 0) {
      throw new Error(
        `${this.entityName} has no updatable columns besides "${this.idColumn}"`,
      );
    }
    const assignments = updatable.map((c) => `"${c}" = ?`).join(", ");
    const sql = `UPDATE "${this.tableName}" SET ${assignments} WHERE "${this.idColumn}" = ?`;
    const result = this.prepare(sql).run(
      ...updatable.map((c) => row[c] ?? null),
      row[this.idColumn] as SqlValue,
    );
    if (result.changes === 0) {
      throw new Error(`${this.entityName} not found`);
    }
    return input;
  }

  /**
   * Inserts `input`, or overwrites the existing row with the same
   * `idColumn` if one exists. See the class doc — prefer `create`/`update`
   * unless the caller truly can't know in advance which case applies.
   */
  upsert(input: T): T {
    const row = this.toRow(input);
    const quoted = this.columns.map((c) => `"${c}"`).join(", ");
    const placeholders = this.columns.map(() => "?").join(", ");
    const updatable = this.columns.filter((c) => c !== this.idColumn);
    // A table whose only column is the primary key has nothing to update on
    // conflict; DO UPDATE SET with an empty assignment list is invalid SQL.
    const conflictAction = updatable.length
      ? `DO UPDATE SET ${updatable.map((c) => `"${c}" = excluded."${c}"`).join(", ")}`
      : "DO NOTHING";
    const sql =
      `INSERT INTO "${this.tableName}" (${quoted}) VALUES (${placeholders}) ` +
      `ON CONFLICT("${this.idColumn}") ${conflictAction}`;
    this.prepare(sql).run(...this.columns.map((c) => row[c] ?? null));
    return input;
  }

  delete(id: string): void {
    this.prepare(`DELETE FROM "${this.tableName}" WHERE "${this.idColumn}" = ?`).run(id);
  }
}
