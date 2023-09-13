import { ColumnDTO as DbColumn } from "@/model/Column/ColumnDTO";
import { TaskDTO as DBTodo } from "@/model/Task/TaskDTO";
import { UserDTO } from "@/model/User/UserDTO";
import { Immutable, produce } from "immer";
import { v4 as uuid } from "uuid";
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
    initialTodos: DBTodo[],
    initialColumns: DbColumn[],
    initialUser?: UserDTO,
  ): void;
  addTodo(newTodo: Omit<Todo, "id">): Todo;
  moveTodo(
    newTodo: Todo,
    fromColumnId: string,
    toColumnId: string,
    position: number,
  ): void;
  addColumn(newColumn: Omit<Column, "id" | "position">): Column;
}

const stateCreator: StateCreator<HomeState & HomeActions> = (set, get) => ({
  todos: {},
  columns: {},

  initialize(initialTodos, initialColumns, initialUser) {
    const columnMap: Record<string, Column> = {};
    const todosMap: Record<string, Todo[]> = {};
    const backendIdToIdMap = new Map<string, string>();

    initialColumns.forEach((backendColumn) => {
      const result: Column = {
        ...backendColumn,
        id: uuid(),
        backendId: backendColumn.id,
      };
      columnMap[result.id] = result;
      if (result.backendId) {
        backendIdToIdMap.set(result.backendId, result.id);
      }
    });

    initialTodos.forEach((backendTodo) => {
      const columnId =
        backendIdToIdMap.get(backendTodo.columnId) ?? backendTodo.columnId;
      if (!todosMap[columnId]) {
        todosMap[columnId] = [];
      }
      todosMap[columnId].push({
        ...backendTodo,
        columnId,
        id: uuid(),
        backendId: backendTodo.id,
      });
    });

    set({ todos: todosMap, columns: columnMap, user: initialUser });
  },

  addTodo: (newTodo) => {
    const result = { ...newTodo, id: uuid() };
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
    const newId = uuid();
    const todos = produce(currentState.todos, (draft) => {
      draft[newId] = [];
    });
    const columns = produce(currentState.columns, (draft) => {
      const position = Object.keys(currentState.columns).length;
      draft[newId] = { ...newColumn, id: newId, position };
    });

    set({ columns, todos });
    return columns[newId];
  },
});

export const useZustand = create(stateCreator);
