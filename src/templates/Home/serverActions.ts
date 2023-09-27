"use server";

import { ColumnDTO, ColumnRepository } from "@/model/Column";
import { TaskDTO, TaskRepository } from "@/model/Task";

export async function addColumnAction(newColumn: ColumnDTO) {
  const columnRepository = new ColumnRepository();
  columnRepository.create(newColumn);
}

export async function addTodoAction(newTodo: TaskDTO) {
  const columnRepository = new TaskRepository();
  columnRepository.create(newTodo);
}

export async function editTodoAction(editedTodo: TaskDTO) {
  const columnRepository = new TaskRepository();
  columnRepository.update(editedTodo);
}
