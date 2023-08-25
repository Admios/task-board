import { AbstractRepository, Task } from "@/model/types";
import { taskDatabase } from "./TaskDatabase";

export class TaskRepository implements AbstractRepository<Task> {
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

  async create(task: Task) {
    taskDatabase.set(task.id, task);
    return task;
  }

  async update(id: string, task: Task) {
    taskDatabase.set(id, task);
    return task;
  }

  async delete(id: string) {
    taskDatabase.delete(id);
  }
}
