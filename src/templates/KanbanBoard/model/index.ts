import { produce } from "immer";
import { StateCreator, create } from "zustand";
import { State, Task } from "./types";
import { KanbanState, KanbanActions } from "./state";

export type { State, Task } from "./types";

const defaultState: KanbanState = {
  boardId: "",
  statesOrder: [],
  tasksOrder: {},
  tasks: {},
  states: {},
  user: undefined,
};

const stateCreator: StateCreator<KanbanState & KanbanActions> = (set, get) => ({
  ...defaultState,

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

  setBoardId(boardId) {
    set({ boardId });
  },

  addTask: (newTask) => {
    const tasks = produce(get().tasks, (draft) => {
      draft[newTask.id] = newTask;
      return draft;
    });

    const tasksOrder = produce(get().tasksOrder, (draft) => {
      if (!draft[newTask.stateId]) {
        draft[newTask.stateId] = [];
      }
      draft[newTask.stateId].push(newTask.id);
      return draft;
    });

    set({ tasks, tasksOrder });
    return newTask;
  },

  moveTask: (newTask, fromStateId, toStateId, position) => {
    const newTasksOrder = produce(get().tasksOrder, (draftState) => {
      let sourceState = draftState[fromStateId] ?? [];
      // Remove item from the source array
      sourceState = sourceState.filter((id) => id !== newTask.id);

      // Add item to the destination (whichever it is)
      if (fromStateId === toStateId) {
        sourceState.splice(position, 0, newTask.id);
      } else {
        const destinationState = draftState[toStateId] ?? [];
        destinationState.splice(position, 0, newTask.id);
        draftState[toStateId] = destinationState;
      }

      draftState[fromStateId] = sourceState;
      return draftState;
    });

    // Update inner task states
    const updatedTasks = produce(get().tasks, (draft) => {
      newTasksOrder[fromStateId].forEach((taskId, index) => {
        draft[taskId].position = index;
        if (fromStateId !== toStateId) {
          draft[taskId].stateId = fromStateId;
        }
      });

      if (fromStateId !== toStateId) {
        newTasksOrder[toStateId].forEach((taskId, index) => {
          draft[taskId].position = index;
          draft[taskId].stateId = toStateId;
        });
      }
      return draft;
    });

    set({ tasksOrder: newTasksOrder, tasks: updatedTasks });
  },

  addState: (newState) => {
    const tasksOrder = produce(get().tasksOrder, (draft) => {
      draft[newState.id] = [];
      return draft;
    });

    const statesOrder = produce(get().statesOrder, (draft) => {
      draft.push(newState.id);
      return draft;
    });

    const states = produce(get().states, (draft) => {
      draft[newState.id] = newState;
      return draft;
    });

    set({ states, tasksOrder, statesOrder });
    return states[newState.id];
  },

  editTask: (taskId, updatedValues) => {
    const tasks = produce(get().tasks, (draft) => {
      draft[taskId] = { ...draft[taskId], ...updatedValues };
      return draft;
    });

    set({ tasks });
  },

  deleteTask: (taskId) => {
    const { stateId } = get().tasks[taskId];
    const tasksOrder = produce(get().tasksOrder, (draft) => {
      draft[stateId] = draft[stateId].filter((id) => id !== taskId);
      return draft;
    });

    const tasks = produce(get().tasks, (draft) => {
      delete draft[taskId];
      return draft;
    });

    set({ tasks, tasksOrder });
  },

  clear: () => {
    set({ ...defaultState });
  },
});

export const useZustand = create(stateCreator);
