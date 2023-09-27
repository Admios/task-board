'use server';

import { TaskDTO, TaskRepository } from "@/model/Task";

export async function editTodoAction(editedTodo: TaskDTO) {
    const columnRepository = new TaskRepository();
    columnRepository.update(editedTodo);
  }