import { AbstractRepository } from "@/model/AbstractRepository";
import { client } from "@/model/CassandraClient";
import { UserDTO } from "./UserDTO";

export class UserRepository extends AbstractRepository<UserDTO> {
  public get tableName() {
    return "users";
  }

  public get entityName() {
    return "User";
  }

  async createTable() {
    await client.execute(
      `CREATE TABLE IF NOT EXISTS ${this.tableName} (
        id text,
        username text,
        current_challenge text,
        PRIMARY KEY (id)
      )`,
    );

    await client.execute(
      `CREATE INDEX idx_${this.tableName}_username ON ${this.tableName} (username)`,
    );
  }

  async findByUsername(username: string) {
    // TODO: Use a Materialized View instead of a secondary index
    const query = this.mapper.mapWithQuery(
      `SELECT * FROM ${this.tableName} WHERE username = ? LIMIT 1`,
      (doc: { name: string }) => [doc.name],
    );
    const result = await query({ name: username });

    const item = result.first();
    if (!item) {
      throw new Error(`${this.entityName} not found`);
    }

    return item;
  }
}
