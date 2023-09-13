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

  /** TODO: this should be outside. */
  async seed() {
    // return Promise.all([
    //   this.create({
    //     id: DefaultColumnId.NEW,
    //     name: "New",
    //     position: 0,
    //     color: "black",
    //   }),
    //   this.create({
    //     id: DefaultColumnId.IN_PROGRESS,
    //     name: "In Progress",
    //     position: 1,
    //     color: "orange",
    //   }),
    //   this.create({
    //     id: DefaultColumnId.IN_REVIEW,
    //     name: "In Review",
    //     position: 2,
    //     color: "green",
    //   }),
    //   this.create({
    //     id: DefaultColumnId.DONE,
    //     name: "Done",
    //     position: 3,
    //     color: "blue",
    //   }),
    // ]);
  }

  async createTable() {
    return client.execute(
      `CREATE TABLE IF NOT EXISTS ${this.tableName} (id text, name text, position int, color text, PRIMARY KEY (id))`,
    );
  }
}
