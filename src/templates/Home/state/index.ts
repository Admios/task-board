import { ColumnDTO } from "@/model/Column";
import { TaskDTO } from "@/model/Task";
import { UserDTO } from "@/model/User";
import { Immutable, produce } from "immer";
import { StateCreator, create } from "zustand";
import { Column, Todo } from "./types";

export type { Column, Todo } from "./types";

type HomeState = Immutable<{
  todos: Record<string, Todo[]>;
  columns: Record<string, Column>;
  user?: UserDTO;
}>;

interface HomeActions {
  initialize(
    initialTodos: TaskDTO[],
    initialColumns: ColumnDTO[],
    initialUser?: UserDTO,
  ): void;
  addTodo(newTodo: Todo): Todo;
  moveTodo(
    newTodo: Todo,
    fromColumnId: string,
    toColumnId: string,
    position: number,
  ): void;
  addColumn(newColumn: Column): Column;
  editTodo(todoId: string, updatedValues: Partial<Todo>): void;
  deleteTodo: (todoId: string) => void;
}

const stateCreator: StateCreator<HomeState & HomeActions> = (set, get) => ({
  todos: {},
  columns: {},

  initialize(initialTodos, initialColumns, initialUser) {
    const columnMap: Record<string, Column> = {};
    const todosMap: Record<string, Todo[]> = {};

    initialColumns.forEach((backendColumn) => {
      const result: Column = {
        ...backendColumn,
        id: backendColumn.id,
        position: backendColumn.position,
      };
      columnMap[result.id] = result;
    });

    initialTodos.forEach((backendTodo) => {
      const columnId = backendTodo.columnId;
      if (!todosMap[columnId]) {
        todosMap[columnId] = [];
      }
      todosMap[columnId][backendTodo.position] = {
        ...backendTodo,
        columnId,
        id: backendTodo.id,
        position: backendTodo.position,
      };
    });

    set({ todos: todosMap, columns: columnMap, user: initialUser });
  },

  addTodo: (newTodo) => {
    const result = { ...newTodo };
    const todos = produce(get().todos, (draft) => {
      if (!draft[newTodo.columnId]) {
        draft[newTodo.columnId] = [];
      }

      draft[newTodo.columnId].push(result);
    });

    set({ todos });
    return result;
  },

  moveTodo: (newTodo, fromColumnId, toColumnId, position) => {
    const todos = produce(get().todos, (draftState) => {
      const sourceColumn = (draftState[fromColumnId] ?? []).filter(
        (todo) => todo.id !== newTodo.id,
      );

      let destinationColumn = draftState[toColumnId] ?? [];
      if (fromColumnId === toColumnId) {
        destinationColumn = sourceColumn;
      }

      if (position <= destinationColumn.length) {
        destinationColumn.splice(position, 0, newTodo);
      } else {
        destinationColumn.push(newTodo);
      }

      draftState[fromColumnId] = sourceColumn;
      draftState[toColumnId] = destinationColumn;
    });

    set({ todos });
  },

  addColumn: (newColumn) => {
    const currentState = get();
    const todos = produce(currentState.todos, (draft) => {
      draft[newColumn.id] = [];
    });
    const columns = produce(currentState.columns, (draft) => {
      const position = Object.keys(currentState.columns).length;
      draft[newColumn.id] = { ...newColumn, position };
    });

    set({ columns, todos });
    return columns[newColumn.id];
  },

  editTodo: (todoId, updatedValues) => {
    const currentState = get();
    const todos = produce(currentState.todos, (draft) => {
      for (const columnId in draft) {
        const columnTodos = draft[columnId];
        const todoIndex = columnTodos.findIndex(todo => todo.id === todoId);
        if (todoIndex > -1) {
          columnTodos[todoIndex] = { ...columnTodos[todoIndex], ...updatedValues };
          break;
        }
      }
    });

    set({ todos });
  },
  
  deleteTodo: (todoId) => {
    const currentState = get();
    const todos = produce(currentState.todos, (draft) => {
      for (const columnId in draft) {
        const columnTodos = draft[columnId];
        const todoIndex = columnTodos.findIndex(todo => todo?.id === todoId);
        if (todoIndex > -1) {
          columnTodos.splice(todoIndex, 1);
          break;
        }
      }
    });

    set({ todos });
  },
});

export const useZustand = create(stateCreator);
