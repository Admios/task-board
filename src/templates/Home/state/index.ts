import { v4 as uuid } from "uuid";
import { create } from "zustand";
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
import { Column, ColumnId, Todo } from "./types";

export type { Column, ColumnId, Todo } from "./types";

interface HomeState {
  columnNew: Todo[];
  columnInProgress: Todo[];
  columnReview: Todo[];
  columnDone: Todo[];
  columns: Record<ColumnId, Column>;
}

interface HomeActions {
  addTodo(title: string, columnId: ColumnId): void;
  moveTodo(newTodo: Todo, fromColumnId: ColumnId, toColumnId: ColumnId): void;
}

export const useZustand = create<HomeState & HomeActions>((set, get) => ({
  columnNew: columnNewTodos,
  columnInProgress: columnInProgressTodos,
  columnReview: columnInReviewTodos,
  columnDone: columnDoneTodos,
  columns: {
    columnNew,
    columnDone,
    columnInProgress,
    columnReview: columnInReview,
  },

  addTodo: (title, columnId) => {
    const currentState = get();

    return set({
      [columnId]: currentState[columnId].push({
        id: uuid(),
        text: title,
      }),
    });
  },

  moveTodo: (newTodo, fromColumnId, toColumnId) => {
    const currentState = get();

    return set({
      [fromColumnId]: currentState[fromColumnId].filter(
        (todo) => todo.id !== newTodo.id
      ),
      [toColumnId]: currentState[toColumnId].push(newTodo),
    });
  },
}));
