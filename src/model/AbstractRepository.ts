import { client } from "@/model/CassandraClient";
import { types } from "cassandra-driver";

export abstract class AbstractRepository<T> {
  protected abstract get tableName(): string;
  protected abstract get entityName(): string;

  protected abstract convertEntityToDTO(row: types.Row): T;

  public abstract seed(): Promise<void>;

  async findById(id: string): Promise<T> {
    const query = await client.execute("SELECT * FROM ? WHERE id = ? LIMIT 1", [
      this.tableName,
      id,
    ]);

    if (!query.rows.length) {
      throw new Error(`${this.entityName} not found`);
    }

    return this.convertEntityToDTO(query.rows[0]);
  }

  async list(): Promise<T[]> {
    const query = await client.execute("SELECT * FROM ?", [this.tableName]);
    return query.rows.map((row) => this.convertEntityToDTO(row));
  }

  async create(input: Omit<T, "id">): Promise<T> {
    const query = await client.execute("INSERT INTO ? JSON '?'", [
      this.tableName,
      JSON.stringify(input),
    ]);

    return this.convertEntityToDTO(query.rows[0]);
  }

  async update(id: string, input: Omit<T, "id">): Promise<T> {
    const query = await client.execute("UPDATE ? SET JSON '?' WHERE id = ?", [
      this.tableName,
      JSON.stringify(input),
      id,
    ]);

    return this.convertEntityToDTO(query.rows[0]);
  }

  async delete(id: string) {
    return client.execute("DELETE FROM ? WHERE id = ?", [this.tableName, id]);
  }
}
