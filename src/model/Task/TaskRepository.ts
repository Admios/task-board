import { BaseRepository } from "@/model/BaseRepository";
import { TaskDTO } from "./TaskDTO";

export class TaskRepository extends BaseRepository<TaskDTO> {
  public get tableName() {
    return "tasks";
  }

  public get entityName() {
    return "Task";
  }

  async listByStateId(stateId: string) {
    const query = this.mapper.mapWithQuery(
      `SELECT * FROM ${this.tableName} WHERE state_id = ?`,
      (doc: { id: string }) => [doc.id],
    );
    const result = await query({ id: stateId });
    return result.toArray();
  }

  async listByStateIdList(stateIds: string[]) {
    const masks = stateIds.map(() => "?").join(", ");
    const query = this.mapper.mapWithQuery(
      `SELECT * FROM ${this.tableName} WHERE state_id IN (${masks}) ALLOW FILTERING`,
      () => stateIds,
    );
    const result = await query({});
    return result.toArray();
  }
}
