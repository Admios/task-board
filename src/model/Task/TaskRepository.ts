import { BaseRepository } from "@/model/BaseRepository";
import { client } from "@/model/CassandraClient";
import { TaskDTO } from "./TaskDTO";

export class TaskRepository extends BaseRepository<TaskDTO> {
  public get tableName() {
    return "tasks";
  }

  public get entityName() {
    return "Task";
  }

  async createTable() {
    return client.execute(
      `CREATE TABLE IF NOT EXISTS ${this.tableName} (id text, text text, column_id text, position int, PRIMARY KEY (id))`,
    );
  }
}
