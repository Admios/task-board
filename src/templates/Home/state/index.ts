import { ColumnDTO } from "@/model/Column";
import { TaskDTO } from "@/model/Task";
import { UserDTO } from "@/model/User";
import { Immutable, produce } from "immer";
import { v4 as uuid } from "uuid";
import { StateCreator, create } from "zustand";
import { Column, Todo } from "./types";

export type { Column, Todo } from "./types";

type HomeState = Immutable<{
  todos: TaskDTO[];
  columns: ColumnDTO[];
  user?: UserDTO;
}>;

interface HomeActions {
  initialize(
    initialTodos: TaskDTO[],
    initialColumns: ColumnDTO[],
    initialUser?: UserDTO,
  ): void;
  addColumn(newColumn: Column): Column;
  addTodo(newTodo: Todo): Todo;
  moveTodo(
    newTodo: Todo,
    fromColumnId: string,
    toColumnId: string,
    position: number,
  ): void;
  editTodo(
    editedTodo: Todo,
  ): void;
}

const stateCreator: StateCreator<HomeState & HomeActions> = (set, get) => ({
  todos: [],
  columns: [],

  initialize(initialTodos, initialColumns, initialUser) {
    set({ todos: initialTodos, columns: initialColumns, user: initialUser });
  },

  addColumn: (newColumn) => {
      const columns = produce(get().columns, (draft) => {
        draft.push(newColumn);
      });
      set({ columns });
      return newColumn;
  },

  addTodo: (newTodo) => {
    const todos = produce(get().todos, (draft) => {
      draft.push(newTodo);
    });
    set({ todos });
    return newTodo;
  },

  moveTodo: (newTodo, fromColumnId, toColumnId, position) => {
    const todos = produce(get().todos, (draft) => {
      const todoIndex = draft.findIndex((todo) => todo.id === newTodo.id);
      draft[todoIndex] = {...newTodo, columnId: toColumnId, position};
    });
    set({ todos });
  },
  editTodo: (editedTodo) => {
    const todos = produce(get().todos, (draft) => {
      const todoIndex = draft.findIndex((todo) => todo.id === editedTodo.id);
      draft[todoIndex] = {...editedTodo};
    });
    set({ todos });
  }
});

export const useZustand = create(stateCreator);
