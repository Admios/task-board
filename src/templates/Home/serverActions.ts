"use server";

import { ColumnDTO, ColumnRepository } from "@/model/Column";
import { TaskDTO, TaskRepository } from "@/model/Task";

export async function addColumnToDB(newColumn: ColumnDTO) {
  const columnRepository = new ColumnRepository();
  columnRepository.create(newColumn);
}

export async function addTodoToDB(newTodo: TaskDTO) {
  const columnRepository = new TaskRepository();
  columnRepository.create(newTodo);
}

export async function editTodoToDB(editedTodo: TaskDTO) {
  const columnRepository = new TaskRepository();
  columnRepository.update(editedTodo);
}
