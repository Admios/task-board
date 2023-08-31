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

  async create(input: Task) {
    taskDatabase.set(input.id, input);
    return input;
  }

  async update(id: string, input: Task) {
    taskDatabase.set(id, input);
    return input;
  }

  async delete(id: string) {
    taskDatabase.delete(id);
  }
}
