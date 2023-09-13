import { AbstractRepository } from "@/model/AbstractRepository";
import { DefaultColumnId } from "@/model/Column/ColumnDTO";
import { types } from "cassandra-driver";
import { TaskDTO } from "./TaskDTO";

export class TaskRepository extends AbstractRepository<TaskDTO> {
  protected get tableName() {
    return "tasks";
  }

  protected get entityName() {
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

  /**
   * TODO: this should be outside.
   */
  async seed() {
    const tasks: Omit<TaskDTO, "id">[] = [];

    ["Task 17", "Task 28", "Task 39"].forEach((text, index) => {
      tasks.push({
        text,
        columnId: DefaultColumnId.NEW,
        position: index,
      });
    });

    ["Task 45", "Task 56"].forEach((text, index) => {
      tasks.push({
        text,
        columnId: DefaultColumnId.IN_PROGRESS,
        position: index,
      });
    });

    ["Task 87", "Task 29", "Task 63", "Task 4"].forEach((text, index) => {
      tasks.push({
        text,
        columnId: DefaultColumnId.IN_REVIEW,
        position: index,
      });
    });

    ["Task 7", "Task 8", "Task 9"].forEach((text, index) => {
      tasks.push({
        text,
        columnId: DefaultColumnId.DONE,
        position: index,
      });
    });

    const promises = tasks.map((task) => this.create(task));
    await Promise.all(promises);
  }
}
