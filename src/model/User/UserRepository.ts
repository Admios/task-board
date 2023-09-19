import { AbstractRepository } from "@/model/AbstractRepository";
import { client } from "@/model/CassandraClient";
import { UserDTO } from "./UserDTO";
import { UserEntity } from "./UserEntity";

export class UserRepository extends AbstractRepository<UserDTO, UserEntity> {
  public get tableName() {
    return "users";
  }

  public get entityName() {
    return "User";
  }

  public convertEntityToDTO(entity: UserEntity): UserDTO {
    return {
      id: entity.id,
      username: entity.username,
      currentChallenge: entity.currentChallenge,
    };
  }

  public convertDTOToEntity(dto: UserDTO): UserEntity {
    return {
      id: dto.id,
      username: dto.username,
      currentChallenge: dto.currentChallenge,
    };
  }

  async createTable() {
    return client.execute(
      `CREATE TABLE IF NOT EXISTS ${this.tableName} (id text, username text, current_challenge text, PRIMARY KEY (id))`,
    );
  }

  async findByUsername(username: string) {
    const result = await this.mapper.find({ username });
    const item = result.first();
    if (!item) {
      throw new Error(`${this.entityName} not found`);
    }

    return this.convertEntityToDTO(item);
  }
}
