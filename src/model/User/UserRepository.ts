import { client } from "@/model/CassandraClient";
import { AbstractRepository } from "@/model/AbstractRepository";
import { types } from "cassandra-driver";
import { UserDTO } from "./UserDTO";

export class UserRepository extends AbstractRepository<UserDTO> {
  public get tableName() {
    return "users";
  }

  public get entityName() {
    return "User";
  }

  protected convertEntityToDTO(entity: types.Row) {
    return {
      id: entity.id,
      username: entity.username,
      currentChallenge: entity.currentChallenge,
    };
  }

  async createTable() {
    return client.execute(
      `CREATE TABLE IF NOT EXISTS ${this.tableName} (id text, username text, currentChallenge text, PRIMARY KEY (id))`,
    );
  }

  async findByUsername(username: string) {
    const query = await client.execute("SELECT * FROM ? WHERE username = ?", [
      this.tableName,
      username,
    ]);

    return this.convertEntityToDTO(query.rows[0]);
  }
}
