"use server";

import { StateDTO, StateRepository } from "@/model/State";
import { TaskDTO, TaskRepository } from "@/model/Task";

const stateRepository = new StateRepository();
const taskRepository = new TaskRepository();

export async function addStateDB(newState: StateDTO) {
  stateRepository.create(newState);
}

export async function addTaskDB(newTask: TaskDTO) {
  taskRepository.create(newTask);
}

export async function editTaskDB(editedTask: TaskDTO) {
  taskRepository.update(editedTask);
}

export async function deleteTaskDB(id: string) {
  taskRepository.delete(id);
}

export async function moveTaskDB(
  affectedTasks: TaskDTO[],
  stateFromId: string,
  stateToId: string,
  task: TaskDTO,
  newPosition: number,
) {
  if (stateFromId === stateToId) {
    await handleMoveWithinState(affectedTasks, stateFromId, task, newPosition);
  } else {
    await handleMoveBetweenStates(
      affectedTasks,
      stateFromId,
      stateToId,
      task,
      newPosition,
    );
  }

  task.stateId = stateToId;
  task.position = newPosition;
  taskRepository.update(task);
}

async function handleMoveWithinState(
  affectedTasks: TaskDTO[],
  stateId: string,
  task: TaskDTO,
  newPosition: number,
) {
  // Update positions of affected tasks within the same state
  const updatePromises = affectedTasks
    .filter((t) => t.stateId === stateId && t.id !== task.id)
    .map((t) => {
      if (t.position > task.position && t.position <= newPosition) {
        t.position--;
      } else if (t.position < task.position && t.position >= newPosition) {
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
  affectedTasks: TaskDTO[],
  stateFromId: string,
  stateToId: string,
  task: TaskDTO,
  newPosition: number,
) {
  // Update positions of tasks in the source state
  const updateSourcePromises = affectedTasks
    .filter((t) => t.stateId === stateFromId && t.position > task.position)
    .map((t) => {
      t.position--;
      return taskRepository.update(t);
    });

  // Update positions of tasks in the destination state
  const updateDestinationPromises = affectedTasks
    .filter((t) => t.stateId === stateToId && t.position >= newPosition)
    .map((t) => {
      t.position++;
      return taskRepository.update(t);
    });

  await Promise.all([...updateSourcePromises, ...updateDestinationPromises]);
}
