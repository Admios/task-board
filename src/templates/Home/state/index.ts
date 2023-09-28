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
  editTodo(
    editedTodo: Todo,
  ): void;
  moveTodo(
    columnFromId: string,
    columnToId: string,
    todo: Todo,
    newPosition: number,
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
  editTodo: (editedTodo) => {
    const todos = produce(get().todos, (draft) => {
      const todoIndex = draft.findIndex((todo) => todo.id === editedTodo.id);
      draft[todoIndex] = {...editedTodo};
    });
    set({ todos });
  },
  moveTodo: (columnFromId, columnToId, todo, newPosition) => {
    const todos = produce(get().todos, (draft) => {
      if (columnFromId === columnToId) {
        // Adjusting positions of todos within the same column
        const filteredTodos = draft.filter(t => t.columnId === columnFromId && t.id !== todo.id);
        filteredTodos.forEach(t => {
          if (t.position > todo.position && t.position <= newPosition) {
            t.position--;
          } else if (t.position < todo.position && t.position >= newPosition) {
            t.position++;
          }
        });
      } else {
        // Adjusting positions of the todos in the source column
        const sourceTodos = draft.filter(t => t.columnId === columnFromId && t.position > todo.position);
        sourceTodos.forEach(t => t.position--);
  
        // Adjusting positions of the todos in the destination column
        const destinationTodos = draft.filter(t => t.columnId === columnToId && t.position >= newPosition);
        destinationTodos.forEach(t => t.position++);
      }
      
      // Updating the position and column of the moved todo
      const todoIndex = draft.findIndex(t => t.id === todo.id);
      draft[todoIndex].columnId = columnToId;
      draft[todoIndex].position = newPosition;
    });
    set({ todos });
  }
  
});

export const useZustand = create(stateCreator);
