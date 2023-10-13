import { produce } from "immer";
import { StateCreator, create } from "zustand";
import { State, Task } from "./types";
import { KanbanState, KanbanActions } from "./state";

export type { State, Task } from "./types";

const stateCreator: StateCreator<KanbanState & KanbanActions> = (set, get) => ({
  statesOrder: [],
  tasksOrder: {},
  tasks: {},
  states: {},

  initialize(initialTasks, initialStates) {
    const statesOrderSparseArray: string[] = [];
    const tasksOrder: Record<string, string[]> = {};
    const states: Record<string, State> = {};
    const tasks: Record<string, Task> = {};

    initialTasks.forEach((backendTask) => {
      tasks[backendTask.id] = backendTask;
      if (!tasksOrder[backendTask.stateId]) {
        tasksOrder[backendTask.stateId] = [];
      }
      // Warning: saved as sparse array! Compression is done later
      tasksOrder[backendTask.stateId][backendTask.position] = backendTask.id;
    });

    initialStates.forEach((backendState) => {
      states[backendState.id] = backendState;
      // Warning: saved as sparse array! compressed later
      statesOrderSparseArray[backendState.position] = backendState.id;
      // Compress sparse array
      tasksOrder[backendState.id] = (tasksOrder[backendState.id] ?? []).filter(
        (id) => !!id,
      );
    });

    // Compress sparse array
    const statesOrder = statesOrderSparseArray.filter((id) => !!id);

    set({
      statesOrder,
      tasksOrder,
      tasks,
      states,
    });
  },

  setUser(user) {
    set({ user });
  },

  addTask: (newTask) => {
    const tasks = produce(get().tasks, (draft) => {
      draft[newTask.stateId] = newTask;
    });

    const tasksOrder = produce(get().tasksOrder, (draft) => {
      if (!draft[newTask.stateId]) {
        draft[newTask.stateId] = [];
      }
      draft[newTask.stateId].push(newTask.id);
    });

    set({ tasks, tasksOrder });
    return newTask;
  },

  moveTask: (newTask, fromStateId, toStateId, position) => {
    const newTasksOrder = produce(get().tasksOrder, (draftState) => {
      const sourceState = (draftState[fromStateId] ?? []).filter(
        (task) => task !== newTask.id,
      );

      let destinationState = draftState[toStateId] ?? [];
      if (fromStateId === toStateId) {
        destinationState = sourceState;
      }

      if (position <= destinationState.length) {
        destinationState.splice(position, 0, newTask.id);
      } else {
        destinationState.push(newTask.id);
      }

      draftState[fromStateId] = sourceState;
      draftState[toStateId] = destinationState;
    });

    set({ tasksOrder: newTasksOrder });
  },

  addState: (newState) => {
    const tasksOrder = produce(get().tasksOrder, (draft) => {
      draft[newState.id] = [];
    });

    const statesOrder = produce(get().statesOrder, (draft) => {
      draft.push(newState.id);
    });

    const states = produce(get().states, (draft) => {
      draft[newState.id] = newState;
    });

    set({ states, tasksOrder, statesOrder });
    return states[newState.id];
  },

  editTask: (taskId, updatedValues) => {
    const tasks = produce(get().tasks, (draft) => {
      draft[taskId] = { ...draft[taskId], ...updatedValues };
    });

    set({ tasks });
  },

  deleteTask: (taskId) => {
    const { stateId } = get().tasks[taskId];
    const tasksOrder = produce(get().tasksOrder, (draft) => {
      draft[stateId] = draft[stateId].filter((id) => id !== taskId);
    });

    const tasks = produce(get().tasks, (draft) => {
      delete draft[taskId];
    });

    set({ tasks, tasksOrder });
  },
});

export const useZustand = create(stateCreator);
