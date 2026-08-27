"use server";

import { StateDTO, StateRepository } from "@/model/State";
import { TaskDTO, TaskRepository } from "@/model/Task";
import { transaction } from "@/model/SqliteClient";

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
  // Cassandra had no cross-partition transactions, so this used to fire
  // each position update independently. SQLite can do this atomically.
  transaction(() => {
    if (stateFromId === stateToId) {
      handleMoveWithinState(affectedTasks, stateFromId, task, newPosition);
    } else {
      handleMoveBetweenStates(
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
  });
}

function handleMoveWithinState(
  affectedTasks: TaskDTO[],
  stateId: string,
  task: TaskDTO,
  newPosition: number,
) {
  // Update positions of affected tasks within the same state
  affectedTasks
    .filter((t) => t.stateId === stateId && t.id !== task.id)
    .forEach((t) => {
      if (t.position > task.position && t.position <= newPosition) {
        t.position--;
      } else if (t.position < task.position && t.position >= newPosition) {
        t.position++;
      } else {
        return;
      }
      taskRepository.update(t);
    });
}

function handleMoveBetweenStates(
  affectedTasks: TaskDTO[],
  stateFromId: string,
  stateToId: string,
  task: TaskDTO,
  newPosition: number,
) {
  // Update positions of tasks in the source state
  affectedTasks
    .filter((t) => t.stateId === stateFromId && t.position > task.position)
    .forEach((t) => {
      t.position--;
      taskRepository.update(t);
    });

  // Update positions of tasks in the destination state
  affectedTasks
    .filter((t) => t.stateId === stateToId && t.position >= newPosition)
    .forEach((t) => {
      t.position++;
      taskRepository.update(t);
    });
}
