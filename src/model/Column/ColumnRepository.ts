import { AbstractRepository } from "@/model/AbstractRepository";
import { client, mapper } from "@/model/CassandraClient";
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

  public get mapper() {
    return mapper.forModel<ColumnEntity>(this.entityName);
  }

  protected convertEntityToDTO(entity: ColumnEntity): ColumnDTO {
    return {
      id: entity.id,
      name: entity.name,
      position: entity.position,
      color: entity.color,
    };
  }

  async createTable() {
    return client.execute(
      `CREATE TABLE IF NOT EXISTS ${this.tableName} (id text, name text, position int, color text, PRIMARY KEY (id))`,
    );
  }
}
