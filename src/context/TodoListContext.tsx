import React, { Reducer, Dispatch, useReducer } from "react";
import { createContext, useContext } from "react";
import { Todo, TodoList } from "../types";

interface TodoDispatch extends Dispatch<TodoAction> {}

interface TodoListInterface {
  newCol: TodoList;
  inProgressCol: TodoList;
  reviewCol: TodoList;
  doneCol: TodoList;
  dispatch: TodoDispatch;
}

const newCol: TodoList = {
  name: "New",
  pos: 0,
  color: "black",
  todo: [
    {
      pos: 0,
      text: "Task 17",
    },
    {
      pos: 1,
      text: "Task 28",
    },
    {
      pos: 2,
      text: "Task 39",
    },
  ],
};

const inProgressCol: TodoList = {
  name: "In Progress",
  pos: 1,
  color: "red",
  todo: [
    {
      pos: 0,
      text: "Task 45",
    },
    {
      pos: 1,
      text: "Task 56",
    },
  ],
};

const reviewCol: TodoList = {
  name: "Review",
  pos: 2,
  color: "green",
  todo: [
    {
      pos: 0,
      text: "Task 87",
    },
    {
      pos: 1,
      text: "Task 29",
    },
    {
      pos: 2,
      text: "Task 63",
    },
    {
      pos: 3,
      text: "Task 4",
    },
  ],
};

const doneCol: TodoList = {
  name: "Done",
  pos: 3,
  color: "blue",
  todo: [
    {
      pos: 0,
      text: "Task 7",
    },
    {
      pos: 1,
      text: "Task 8",
    },
    {
      pos: 2,
      text: "Task 9",
    },
  ],
};

type DB = Record<string, TodoList>;

const TodoListContext = createContext<TodoListInterface>({
  newCol,
  inProgressCol,
  reviewCol,
  doneCol,
  dispatch: () => {},
});

type AddTodoAction = {
  type: "ADD_TODO";
  payload: {
    column: string;
    todo: Todo;
  };
};

type MoveTodoAction = {
  type: "MOVE_TODO";
  payload: {
    columnFrom: string;
    columnTo: string;
    todo: Todo;
  };
};

type TodoAction = AddTodoAction | MoveTodoAction;

const reducFnc = (db: DB, action: TodoAction): DB => {
  switch (action.type) {
    case "ADD_TODO":
      return {
        ...db,
        [action.payload.column]: {
          ...db[action.payload.column],
        },
      };
    case "MOVE_TODO":
      if (action.payload.columnFrom !== action.payload.columnTo) {
        db[action.payload.columnFrom].todo = db[
          action.payload.columnFrom
        ].todo.filter((x) => {
          return x.pos !== action.payload.todo.pos;
        });
        const newTodo = {
          [action.payload.columnTo]: {
            ...db[action.payload.columnTo],
            todo: [
              ...db[action.payload.columnTo].todo.map((x, i) => {
                return {
                  ...x,
                  pos: i,
                };
              }),
              {
                ...action.payload.todo,
                pos: db[action.payload.columnTo].todo.length,
              },
            ],
          },
        };
        return {
          ...db,
          ...newTodo,
        };
      }
      return { ...db };
  }
};

export const useTodoList = () => useContext(TodoListContext);

export const TodoListContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer<Reducer<DB, TodoAction>>(reducFnc, {
    reviewCol,
    doneCol,
    newCol,
    inProgressCol,
  });

  return (
    <TodoListContext.Provider
      value={{
        newCol: state.newCol,
        inProgressCol: state.inProgressCol,
        reviewCol: state.reviewCol,
        doneCol: state.doneCol,
        dispatch,
      }}
    >
      {children}
    </TodoListContext.Provider>
  );
};
