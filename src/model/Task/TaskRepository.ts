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

  private readonly queryByStateIdList = this.mapper.mapWithQuery(
    `SELECT * FROM ${TASKS_BY_STATE_ID_VIEW} WHERE state_id IN ?`,
    (doc: { stateIds: string[] }) => [doc.stateIds],
  );

  async listByStateIdList(stateIds: string[]) {
    const result = await this.queryByStateIdList({ stateIds });
    return result.toArray();
  }
}
