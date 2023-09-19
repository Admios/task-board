import { AbstractRepository } from "@/model/AbstractRepository";
import { client } from "@/model/CassandraClient";
import { ColumnDTO } from "@/model/Column";
import { ColumnEntity } from "./ColumnEntity";

export class ColumnRepository extends AbstractRepository<
  ColumnDTO,
  ColumnEntity
> {
  public get tableName() {
    return "columns";
  }

  public get entityName() {
    return "Column";
  }

  public convertEntityToDTO(entity: ColumnEntity): ColumnDTO {
    return {
      id: entity.id,
      name: entity.name,
      position: entity.position,
      color: entity.color,
    };
  }

  public convertDTOToEntity(dto: ColumnDTO): ColumnEntity {
    return {
      id: dto.id,
      name: dto.name,
      position: dto.position,
      color: dto.color,
    };
  }

  async createTable() {
    return client.execute(
      `CREATE TABLE IF NOT EXISTS ${this.tableName} (id text, name text, position int, color text, PRIMARY KEY (id))`,
    );
  }
}
