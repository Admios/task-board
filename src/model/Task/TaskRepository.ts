import { AbstractRepository } from "@/model/AbstractRepository";
import { DefaultColumnId, Task } from "@/model/types";
import { TaskEntity, TaskModel } from "./TaskEntity";
import { v4 as uuid } from "uuid";

export class TaskRepository extends AbstractRepository<Task> {
  protected getEntity() {
    return TaskModel;
  }

  protected getEntityName() {
    return "Task";
  }

  protected convertEntityToModel(entity: TaskEntity): Task {
    return entity;
  }

  protected convertModelToEntity(model: Task): TaskEntity {
    return model;
  }

  /**
   * TODO: this should be outside.
   */
  async seed() {
    const tasks: Omit<Task, "id">[] = [];

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

    const promises = tasks.map((task) => {
      return this.create({
        id: uuid(),
        ...task,
      });
    });

    return Promise.all(promises);
  }
}
