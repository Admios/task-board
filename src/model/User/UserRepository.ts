import { client } from "@/model/CassandraClient";
import { AbstractRepository } from "@/model/AbstractRepository";
import { types } from "cassandra-driver";
import { UserDTO } from "./UserDTO";

export class UserRepository extends AbstractRepository<UserDTO> {
  protected get tableName() {
    return "users";
  }

  protected get entityName() {
    return "User";
  }

  protected convertEntityToDTO(entity: types.Row) {
    return {
      id: entity.id,
      username: entity.username,
      currentChallenge: entity.currentChallenge,
    };
  }

  /**
   * TODO: this should be outside.
   */
  async seed() {}

  async findByUsername(username: string) {
    const query = await client.execute("SELECT * FROM ? WHERE username = ?", [
      this.tableName,
      username,
    ]);

    return this.convertEntityToDTO(query.rows[0]);
  }
}
