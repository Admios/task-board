import { StateDTO } from "@/model/State";
import { TaskDTO } from "@/model/Task";
import { UserDTO } from "@/model/User";
import { Immutable, produce } from "immer";
import { StateCreator, create } from "zustand";
import { State, Todo } from "./types";

export type { State, Todo } from "./types";

type HomeState = Immutable<{
  todos: Record<string, Todo[]>;
  states: Record<string, State>;
  user?: UserDTO;
}>;

interface HomeActions {
  initialize(
    initialTodos: TaskDTO[],
    initialStates: StateDTO[],
    initialUser?: UserDTO,
  ): void;
  addTodo(newTodo: Todo): Todo;
  moveTodo(
    newTodo: Todo,
    fromStateId: string,
    toStateId: string,
    position: number,
  ): void;
  addState(newState: State): State;
  editTodo(todoId: string, updatedValues: Partial<Todo>): void;
  deleteTodo: (todoId: string) => void;
}

const stateCreator: StateCreator<HomeState & HomeActions> = (set, get) => ({
  todos: {},
  states: {},

  initialize(initialTodos, initialStates, initialUser) {
    const statesMap: Record<string, State> = {};
    const todosMap: Record<string, Todo[]> = {};

    initialStates.forEach((backendState) => {
      const result: State = {
        ...backendState,
        id: backendState.id,
        position: backendState.position,
      };
      statesMap[result.id] = result;
    });

    initialTodos.forEach((backendTodo) => {
      const { stateId } = backendTodo;
      if (!todosMap[stateId]) {
        todosMap[stateId] = [];
      }
      todosMap[stateId][backendTodo.position] = {
        ...backendTodo,
        stateId,
        id: backendTodo.id,
        position: backendTodo.position,
      };
    });

    set({ todos: todosMap, states: statesMap, user: initialUser });
  },

  addTodo: (newTodo) => {
    const result = { ...newTodo };
    const todos = produce(get().todos, (draft) => {
      if (!draft[newTodo.stateId]) {
        draft[newTodo.stateId] = [];
      }

      draft[newTodo.stateId].push(result);
    });

    set({ todos });
    return result;
  },

  moveTodo: (newTodo, fromStateId, toStateId, position) => {
    const todos = produce(get().todos, (draftState) => {
      const sourceState = (draftState[fromStateId] ?? []).filter(
        (todo) => todo.id !== newTodo.id,
      );

      let destinationState = draftState[toStateId] ?? [];
      if (fromStateId === toStateId) {
        destinationState = sourceState;
      }

      if (position <= destinationState.length) {
        destinationState.splice(position, 0, newTodo);
      } else {
        destinationState.push(newTodo);
      }

      draftState[fromStateId] = sourceState;
      draftState[toStateId] = destinationState;
    });

    set({ todos });
  },

  addState: (newState) => {
    const currentModel = get();
    const todos = produce(currentModel.todos, (draft) => {
      draft[newState.id] = [];
    });
    const states = produce(currentModel.states, (draft) => {
      const position = Object.keys(currentModel.states).length;
      draft[newState.id] = { ...newState, position };
    });

    set({ states, todos });
    return states[newState.id];
  },

  editTodo: (todoId, updatedValues) => {
    const currentState = get();
    const todos = produce(currentState.todos, (draft) => {
      for (const stateId in draft) {
        const stateTodos = draft[stateId];
        const todoIndex = stateTodos.findIndex((todo) => todo.id === todoId);
        if (todoIndex > -1) {
          stateTodos[todoIndex] = {
            ...stateTodos[todoIndex],
            ...updatedValues,
          };
          break;
        }
      }
    });

    set({ todos });
  },

  deleteTodo: (todoId) => {
    const currentState = get();
    const todos = produce(currentState.todos, (draft) => {
      for (const stateId in draft) {
        const stateTodos = draft[stateId];
        const todoIndex = stateTodos.findIndex((todo) => todo?.id === todoId);
        if (todoIndex > -1) {
          stateTodos.splice(todoIndex, 1);
          break;
        }
      }
    });

    set({ todos });
  },
});

export const useZustand = create(stateCreator);
