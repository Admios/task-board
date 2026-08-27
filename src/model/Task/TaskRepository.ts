import { BaseRepository } from "@/model/BaseRepository";
import { defineColumns } from "@/model/columns";
import { TaskDTO } from "./TaskDTO";

export class TaskRepository extends BaseRepository<TaskDTO> {
  constructor() {
    super({
      tableName: "tasks",
      entityName: "Task",
      columns: defineColumns<TaskDTO>({
        id: true,
        text: true,
        stateId: true,
        position: true,
      }),
    });
  }

  listByStateIdList(stateIds: string[]) {
    if (stateIds.length === 0) {
      return [];
    }
    const placeholders = stateIds.map(() => "?").join(", ");
    return this.query(
      `SELECT * FROM "${this.tableName}" WHERE "stateId" IN (${placeholders})`,
      ...stateIds,
    );
  }
}
