import { AbstractRepository } from "@/model/AbstractRepository";

export interface TaskEntity {
  id: string;
  text: string;
  columnId: string;
  position: number;
}

const taskDatabase: TaskEntity[] = [];

export class TaskRepository implements AbstractRepository<TaskEntity> {
  constructor() {}

  async findById(id: string) {
    const item = taskDatabase.find((t) => t.id === id);

    if (!item) {
      throw new Error("Task not found");
    }

    return item;
  }

  async list() {
    return taskDatabase;
  }

  async create(task: TaskEntity) {
    taskDatabase.push(task);
    return task;
  }

  async update(task: TaskEntity) {
    const index = taskDatabase.findIndex((t) => t.id === task.id);
    taskDatabase[index] = task;
    return task;
  }

  async delete(task: TaskEntity) {
    const index = taskDatabase.findIndex((t) => t.id === task.id);
    taskDatabase.splice(index, 1);
    return task;
  }
}
