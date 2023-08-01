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
import { Column, ColumnId, Todo } from "./types";

export type { Column, ColumnId, Todo } from "./types";

type HomeState = Immutable<{
  columnNew: Todo[];
  columnInProgress: Todo[];
  columnReview: Todo[];
  columnDone: Todo[];
  columns: Record<ColumnId, Column>;
}>;

interface HomeActions {
  addTodo(title: string, columnId: ColumnId): void;
  moveTodo(newTodo: Todo, fromColumnId: ColumnId, toColumnId: ColumnId): void;
}

const stateCreator: StateCreator<HomeState & HomeActions> = (set, get) => ({
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
    const newArray = produce(get()[columnId], (draft) => {
      draft.push({
        id: uuid(),
        text: title,
      });
    });

    set({ [columnId]: newArray });
  },

  moveTodo: (newTodo, fromColumnId, toColumnId) => {
    if (fromColumnId === toColumnId) {
      // do nothing if the todo is moved to the same column
      return;
    }

    const currentState = get();
    const sourceColumn = produce(currentState[fromColumnId], (draft) => {
      // NOTE: `filter` does not modify `draft` in place, so we need to assign it back to `draft`
      return draft.filter((todo) => todo.id !== newTodo.id);
    });
    const destinationColumn = produce(currentState[toColumnId], (draft) => {
      draft.push(newTodo);
    });

    set({
      [fromColumnId]: sourceColumn,
      [toColumnId]: destinationColumn,
    });
  },
});

export const useZustand = create(stateCreator);
