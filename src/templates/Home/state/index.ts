import { Immutable, produce } from "immer";
import { v4 as uuid } from "uuid";
import { StateCreator, create } from "zustand";
import {
  columnDone,
  columnDoneTodos,
  columnInProgress,
  columnInProgressTodos,
  columnInReview,
  columnInReviewTodos,
  columnNew,
  columnNewTodos,
} from "./initialData";
import { Column, Todo } from "./types";

export type { Column, Todo } from "./types";

type HomeState = Immutable<{
  todos: Record<string, Todo[]>;
  columns: Record<string, Column>;
}>;

interface HomeActions {
  addTodo(title: string, columnId: string): void;
  moveTodo(
    newTodo: Todo,
    fromColumnId: string,
    toColumnId: string,
    position: number
  ): void;
  addColumn(columnId: string, name: string, color?: string): void;
}

const stateCreator: StateCreator<HomeState & HomeActions> = (set, get) => ({
  todos: {
    columnNew: columnNewTodos,
    columnInProgress: columnInProgressTodos,
    columnReview: columnInReviewTodos,
    columnDone: columnDoneTodos,
  },

  columns: {
    columnNew,
    columnDone,
    columnInProgress,
    columnReview: columnInReview,
  },

  addTodo: (title, columnId) => {
    const todos = produce(get().todos, (draft) => {
      const todosList = draft[columnId] ?? [];
      todosList.push({
        id: uuid(),
        text: title,
      });
    });

    set({ todos });
  },

  moveTodo: (newTodo, fromColumnId, toColumnId, position) => {
    const todos = produce(get().todos, (draftState) => {
      const sourceColumn = (draftState[fromColumnId] ?? []).filter(
        (todo) => todo.id !== newTodo.id
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

  addColumn: (id, name, color = "black") => {
    const currentState = get();
    const todos = produce(currentState.todos, (draft) => {
      draft[id] = [];
    });
    const columns = produce(currentState.columns, (draft) => {
      const position = Object.keys(currentState.columns).length;
      draft[id] = { id, position, color, name };
    });

    set({ columns, todos });
  },
});

export const useZustand = create(stateCreator);
