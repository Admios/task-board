import { AbstractRepository } from "@/model/AbstractRepository";
import { client } from "@/model/CassandraClient";
import { types } from "cassandra-driver";
import { TaskDTO } from "./TaskDTO";

export class TaskRepository extends AbstractRepository<TaskDTO> {
  public get tableName() {
    return "tasks";
  }

  public get entityName() {
    return "Task";
  }

  protected convertEntityToDTO(entity: types.Row): TaskDTO {
    return {
      id: entity.id,
      text: entity.text,
      columnId: entity.columnId,
      position: entity.position,
    };
  }

  async createTable() {
    return client.execute(
      `CREATE TABLE IF NOT EXISTS ${this.tableName} (id text, text text, columnId text, position int, PRIMARY KEY (id))`,
    );
  }
}
