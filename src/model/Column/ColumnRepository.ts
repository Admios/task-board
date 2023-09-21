import { BaseRepository } from "@/model/BaseRepository";
import { client } from "@/model/CassandraClient";
import { ColumnDTO } from "@/model/Column";

export class ColumnRepository extends BaseRepository<ColumnDTO> {
  public get tableName() {
    return "columns";
  }

  public get entityName() {
    return "Column";
  }

  async createTable() {
    return client.execute(
      `CREATE TABLE IF NOT EXISTS ${this.tableName} (id text, name text, position int, color text, PRIMARY KEY (id))`,
    );
  }
}
