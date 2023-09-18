import { AbstractRepository } from "@/model/AbstractRepository";
import { client, mapper } from "@/model/CassandraClient";
import { TaskDTO } from "./TaskDTO";
import { TaskEntity } from "./TaskEntity";

export class TaskRepository extends AbstractRepository<TaskDTO, TaskEntity> {
  public get tableName() {
    return "tasks";
  }

  public get entityName() {
    return "Task";
  }

  public get mapper() {
    return mapper.forModel<TaskEntity>(this.entityName);
  }

  protected convertEntityToDTO(entity: TaskEntity): TaskDTO {
    return {
      id: entity.id,
      text: entity.text,
      columnId: entity.columnId,
      position: entity.position,
    };
  }

  async createTable() {
    return client.execute(
      `CREATE TABLE IF NOT EXISTS ${this.tableName} (id text, text text, column_id text, position int, PRIMARY KEY (id))`,
    );
  }
}
