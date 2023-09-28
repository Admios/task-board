"use server";

import { ColumnDTO, ColumnRepository } from "@/model/Column";
import { TaskDTO, TaskRepository } from "@/model/Task";

export async function addColumnDB(newColumn: ColumnDTO) {
  const columnRepository = new ColumnRepository();
  columnRepository.create(newColumn);
}

export async function addTodoDB(newTodo: TaskDTO) {
  const columnRepository = new TaskRepository();
  columnRepository.create(newTodo);
}

export async function editTodoDB(editedTodo: TaskDTO) {
  const columnRepository = new TaskRepository();
  columnRepository.update(editedTodo);
}

export async function moveTodoDB(
  todos: TaskDTO[],
  columnFromId: string,
  columnToId: string,
  todo: TaskDTO,
  newPosition: number,
) {
  const columnRepository = new TaskRepository();

  if (columnFromId === columnToId) {
    await handleMoveWithinColumn(todos, columnFromId, todo, newPosition, columnRepository);
  } else {
    await handleMoveBetweenColumns(todos, columnFromId, columnToId, todo, newPosition, columnRepository);
  }

  todo.columnId = columnToId;
  todo.position = newPosition;
  await columnRepository.update(todo);
}

async function handleMoveWithinColumn(
  todos: TaskDTO[],
  columnId: string,
  todo: TaskDTO,
  newPosition: number,
  columnRepository: TaskRepository,
) {
  // Update positions of affected todos within the same column
  const updatePromises = todos
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
  todos: TaskDTO[],
  columnFromId: string,
  columnToId: string,
  todo: TaskDTO,
  newPosition: number,
  columnRepository: TaskRepository,
) {
  // Update positions of todos in the source column
  const updateSourcePromises = todos
    .filter((t) => t.columnId === columnFromId && t.position > todo.position)
    .map((t) => {
      t.position--;
      return columnRepository.update(t);
    });

  // Update positions of todos in the destination column
  const updateDestinationPromises = todos
    .filter((t) => t.columnId === columnToId && t.position >= newPosition)
    .map((t) => {
      t.position++;
      return columnRepository.update(t);
    });

  await Promise.all([...updateSourcePromises, ...updateDestinationPromises]);
}




