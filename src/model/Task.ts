import { AbstractRepository } from "@/model/AbstractRepository";

export interface TaskEntity {
  id: string;
  text: string;
  columnId: string;
  position: number;
}

const taskDatabase = new Map<string, TaskEntity>();

export class TaskRepository implements AbstractRepository<TaskEntity> {
  async findById(id: string) {
    const item = taskDatabase.get(id);
    if (!item) {
      throw new Error("Task not found");
    }

    return item;
  }

  async list() {
    return Array.from(taskDatabase.values());
  }

  async create(task: TaskEntity) {
    taskDatabase.set(task.id, task);
    return task;
  }

  async update(id: string, task: TaskEntity) {
    taskDatabase.set(id, task);
    return task;
  }

  async delete(id: string) {
    taskDatabase.delete(id);
  }
}
