import { BaseRepository } from "@/model/BaseRepository";
import { TaskDTO } from "./TaskDTO";

export class TaskRepository extends BaseRepository<TaskDTO> {
  public get tableName() {
    return "tasks";
  }

  public get entityName() {
    return "Task";
  }

  async listByUserId(userId: string) {
    const query = this.mapper.mapWithQuery(
      `SELECT * FROM ${this.tableName} WHERE owner = ?`,
      (doc: { id: string }) => [doc.id],
    );
    const result = await query({ id: userId });
    return Array.isArray(result) ? result : result.toArray();
  }
}
