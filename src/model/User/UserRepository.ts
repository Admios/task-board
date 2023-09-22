import { BaseRepository } from "@/model/BaseRepository";
import { client } from "@/model/CassandraClient";
import { UserDTO } from "./UserDTO";

export class UserRepository extends BaseRepository<UserDTO> {
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
        current_challenge text,
        PRIMARY KEY (id)
      )`,
    );
  }
}
