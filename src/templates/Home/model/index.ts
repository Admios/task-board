import { StateDTO } from "@/model/State";
import { TaskDTO } from "@/model/Task";
import { UserDTO } from "@/model/User";
import { Immutable, produce } from "immer";
import { StateCreator, create } from "zustand";
import { State, Task } from "./types";

export type { State, Task } from "./types";

type HomeState = Immutable<{
  tasks: Record<string, Task[]>;
  states: Record<string, State>;
  user?: UserDTO;
}>;

interface HomeActions {
  initialize(
    initialTasks: TaskDTO[],
    initialStates: StateDTO[],
    initialUser?: UserDTO,
  ): void;
  addTask(newTask: Task): Task;
  moveTask(
    newTask: Task,
    fromStateId: string,
    toStateId: string,
    position: number,
  ): void;
  addState(newState: State): State;
  editTask(id: string, updatedValues: Partial<Task>): void;
  deleteTask: (id: string) => void;
}

const stateCreator: StateCreator<HomeState & HomeActions> = (set, get) => ({
  tasks: {},
  states: {},

  initialize(initialTasks, initialStates, initialUser) {
    const statesMap: Record<string, State> = {};
    const tasksMap: Record<string, Task[]> = {};

    initialStates.forEach((backendState) => {
      const result: State = {
        ...backendState,
        id: backendState.id,
        position: backendState.position,
      };
      statesMap[result.id] = result;
    });

    initialTasks.forEach((backendTask) => {
      const { stateId } = backendTask;
      if (!tasksMap[stateId]) {
        tasksMap[stateId] = [];
      }
      tasksMap[stateId][backendTask.position] = {
        ...backendTask,
        stateId,
        id: backendTask.id,
        position: backendTask.position,
      };
    });

    set({ tasks: tasksMap, states: statesMap, user: initialUser });
  },

  addTask: (newTask) => {
    const result = { ...newTask };
    const tasks = produce(get().tasks, (draft) => {
      if (!draft[newTask.stateId]) {
        draft[newTask.stateId] = [];
      }

      draft[newTask.stateId].push(result);
    });

    set({ tasks });
    return result;
  },

  moveTask: (newTask, fromStateId, toStateId, position) => {
    const tasks = produce(get().tasks, (draftState) => {
      const sourceState = (draftState[fromStateId] ?? []).filter(
        (task) => task.id !== newTask.id,
      );

      let destinationState = draftState[toStateId] ?? [];
      if (fromStateId === toStateId) {
        destinationState = sourceState;
      }

      if (position <= destinationState.length) {
        destinationState.splice(position, 0, newTask);
      } else {
        destinationState.push(newTask);
      }

      draftState[fromStateId] = sourceState;
      draftState[toStateId] = destinationState;
    });

    set({ tasks });
  },

  addState: (newState) => {
    const currentModel = get();
    const tasks = produce(currentModel.tasks, (draft) => {
      draft[newState.id] = [];
    });
    const states = produce(currentModel.states, (draft) => {
      const position = Object.keys(currentModel.states).length;
      draft[newState.id] = { ...newState, position };
    });

    set({ states, tasks });
    return states[newState.id];
  },

  editTask: (taskId, updatedValues) => {
    const currentState = get();
    const tasks = produce(currentState.tasks, (draft) => {
      for (const stateId in draft) {
        const stateTasks = draft[stateId];
        const taskIndex = stateTasks.findIndex((task) => task.id === taskId);
        if (taskIndex > -1) {
          stateTasks[taskIndex] = {
            ...stateTasks[taskIndex],
            ...updatedValues,
          };
          break;
        }
      }
    });

    set({ tasks });
  },

  deleteTask: (taskId) => {
    const currentState = get();
    const tasks = produce(currentState.tasks, (draft) => {
      for (const stateId in draft) {
        const stateTasks = draft[stateId];
        const taskIndex = stateTasks.findIndex((task) => task?.id === taskId);
        if (taskIndex > -1) {
          stateTasks.splice(taskIndex, 1);
          break;
        }
      }
    });

    set({ tasks });
  },
});

export const useZustand = create(stateCreator);
