import { Immutable, produce } from "immer";
import { v4 as uuid } from "uuid";
import { StateCreator, create } from "zustand";
import { Column, Todo } from "./types";

export type { Column, Todo } from "./types";

type HomeState = Immutable<{
  todos: Record<string, Todo[]>;
  columns: Record<string, Column>;
}>;

interface HomeActions {
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
