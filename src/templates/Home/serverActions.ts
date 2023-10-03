"use server";

import { ColumnDTO, ColumnRepository } from "@/model/Column";
import { TaskDTO, TaskRepository } from "@/model/Task";

export async function addColumnDB(newColumn: ColumnDTO) {
  const columnRepository = new ColumnRepository();
  columnRepository.create(newColumn);
}

export async function addTodoDB(newTodo: TaskDTO) {
  const taskRepository = new TaskRepository();
  taskRepository.create(newTodo);
}

export async function editTodoDB(editedTodo: TaskDTO) {
  const taskRepository = new TaskRepository();
  taskRepository.update(editedTodo);
}

export async function moveTodoDB(
  affectedTodos: TaskDTO[],
  columnFromId: string,
  columnToId: string,
  todo: TaskDTO,
  newPosition: number,
) {
  const columnRepository = new TaskRepository();

  if (columnFromId === columnToId) {
    await handleMoveWithinColumn(affectedTodos, columnFromId, todo, newPosition, columnRepository);
  } else {
    await handleMoveBetweenColumns(affectedTodos, columnFromId, columnToId, todo, newPosition, columnRepository);
  }

  todo.columnId = columnToId;
  todo.position = newPosition;
  columnRepository.update(todo);
}

async function handleMoveWithinColumn(
  affectedTodos: TaskDTO[],
  columnId: string,
  todo: TaskDTO,
  newPosition: number,
  columnRepository: TaskRepository,
) {
  // Update positions of affected todos within the same column
  const updatePromises = affectedTodos
    .filter((t) => t.columnId === columnId && t.id !== todo.id)
    .map((t) => {
      if (t.position > todo.position && t.position <= newPosition) {
        t.position--;
      } else if (t.position < todo.position && t.position >= newPosition) {
        t.position++;
      } else {
        return null;
      }
      return columnRepository.update(t);
    })
    .filter((promise) => promise !== null);

  await Promise.all(updatePromises);
}

async function handleMoveBetweenColumns(
  affectedTodos: TaskDTO[],
  columnFromId: string,
  columnToId: string,
  todo: TaskDTO,
  newPosition: number,
  columnRepository: TaskRepository,
) {
  // Update positions of todos in the source column
  const updateSourcePromises = affectedTodos
    .filter((t) => t.columnId === columnFromId && t.position > todo.position)
    .map((t) => {
      t.position--;
      return columnRepository.update(t);
    });

  // Update positions of todos in the destination column
  const updateDestinationPromises = affectedTodos
    .filter((t) => t.columnId === columnToId && t.position >= newPosition)
    .map((t) => {
      t.position++;
      return columnRepository.update(t);
    });

  await Promise.all([...updateSourcePromises, ...updateDestinationPromises]);
}




