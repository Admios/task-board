import { AbstractRepository } from "@/model/AbstractRepository";
import { client } from "@/model/CassandraClient";
import { ColumnDTO } from "@/model/Column";
import { types } from "cassandra-driver";

export class ColumnRepository extends AbstractRepository<ColumnDTO> {
  public get tableName() {
    return "columns";
  }

  public get entityName() {
    return "Column";
  }

  protected convertEntityToDTO(entity: types.Row): ColumnDTO {
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
