"use server";

import { StateDTO, StateRepository } from "@/model/State";
import { TaskDTO, TaskRepository } from "@/model/Task";

const stateRepository = new StateRepository();
const taskRepository = new TaskRepository();

export async function addStateDB(newState: StateDTO) {
  stateRepository.create(newState);
}

export async function addTodoDB(newTodo: TaskDTO) {
  taskRepository.create(newTodo);
}

export async function editTodoDB(editedTodo: TaskDTO) {
  taskRepository.update(editedTodo);
}

export async function deleteTodoDB(todoId: string) {
  taskRepository.delete(todoId);
}

export async function moveTodoDB(
  affectedTodos: TaskDTO[],
  stateFromId: string,
  stateToId: string,
  todo: TaskDTO,
  newPosition: number,
) {
  if (stateFromId === stateToId) {
    await handleMoveWithinState(affectedTodos, stateFromId, todo, newPosition);
  } else {
    await handleMoveBetweenStates(
      affectedTodos,
      stateFromId,
      stateToId,
      todo,
      newPosition,
    );
  }

  todo.stateId = stateToId;
  todo.position = newPosition;
  taskRepository.update(todo);
}

async function handleMoveWithinState(
  affectedTodos: TaskDTO[],
  stateId: string,
  todo: TaskDTO,
  newPosition: number,
) {
  // Update positions of affected todos within the same state
  const updatePromises = affectedTodos
    .filter((t) => t.stateId === stateId && t.id !== todo.id)
    .map((t) => {
      if (t.position > todo.position && t.position <= newPosition) {
        t.position--;
      } else if (t.position < todo.position && t.position >= newPosition) {
        t.position++;
      } else {
        return null;
      }
      return taskRepository.update(t);
    })
    .filter((promise) => promise !== null);

  await Promise.all(updatePromises);
}

async function handleMoveBetweenStates(
  affectedTodos: TaskDTO[],
  stateFromId: string,
  stateToId: string,
  todo: TaskDTO,
  newPosition: number,
) {
  // Update positions of todos in the source state
  const updateSourcePromises = affectedTodos
    .filter((t) => t.stateId === stateFromId && t.position > todo.position)
    .map((t) => {
      t.position--;
      return taskRepository.update(t);
    });

  // Update positions of todos in the destination state
  const updateDestinationPromises = affectedTodos
    .filter((t) => t.stateId === stateToId && t.position >= newPosition)
    .map((t) => {
      t.position++;
      return taskRepository.update(t);
    });

  await Promise.all([...updateSourcePromises, ...updateDestinationPromises]);
}
