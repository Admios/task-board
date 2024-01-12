import { BaseRepository } from "@/model/BaseRepository";
import { TaskDTO } from "./TaskDTO";

// Materialized view that allows us to query tasks by state_id
const TASKS_BY_STATE_ID_VIEW = `tasks_by_state_id`;

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
      `SELECT * FROM ${TASKS_BY_STATE_ID_VIEW} WHERE state_id IN (${masks})`,
      (doc: { stateIds: string[] }) => doc.stateIds,
    );
    const result = await query({ stateIds });
    return result.toArray();
  }
}
