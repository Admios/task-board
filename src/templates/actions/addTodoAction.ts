'use server';

import { TaskDTO, TaskRepository } from "@/model/Task";

export async function addTodoAction(newTodo: TaskDTO) {
    const columnRepository = new TaskRepository();
    columnRepository.create(newTodo);
  }