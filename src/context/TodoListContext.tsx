import React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { TodoList } from "../types";

interface TodoListInterface {
  todos: TodoList;
  addTodo: (task: string, column: string) => void;
  moveTodo: (to: string, item: any) => void;
}

const mockData: TodoList = {
  Review: {
    pos: 0,
    todo: {
      87: {
        pos: 0,
        text: "Task 87",
      },
      29: {
        pos: 1,
        text: "Task 29",
      },
      63: {
        pos: 2,
        text: "Task 63",
      },
      4: {
        pos: 3,
        text: "Task 4",
      },
    },
    color: "green",
  },
  "In Progress": {
    pos: 1,
    todo: {
      45: {
        pos: 0,
        text: "Task 45",
      },
      56: {
        pos: 1,
        text: "Task 56",
      },
    },
    color: "red",
  },
  Done: {
    pos: 2,
    todo: {
      7: {
        pos: 0,
        text: "Task 7",
      },
      98: {
        pos: 1,
        text: "Task 98",
      },
      9: {
        pos: 2,
        text: "Task 9",
      },
    },
    color: "blue",
  },
  New: {
    pos: 3,
    todo: {
      17: {
        pos: 0,
        text: "Task 17",
      },
      28: {
        pos: 1,
        text: "Task 28",
      },
      39: {
        pos: 2,
        text: "Task 39",
      },
    },
    color: "black",
  },
};

const TodoListContext = createContext<TodoListInterface>({
  todos: {},
  addTodo: () => void 0,
  moveTodo: () => void 0,
});

export const useTodoList = () => useContext(TodoListContext);

export const TodoListContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [todos, setTodos] = useState<TodoList>(mockData);

  const addTodo = (task: string, column: string) => {
    const id = new Date().getTime();
    setTodos((prev) => {
      return {
        ...prev,
        [column]: {
          ...prev[column],
          todo: {
            ...prev[column].todo,
            [id]: {
              text: task,
              pos: Object.keys(prev).length,
            },
          },
        },
      };
    });
  };

  const moveTodo = (to: string, item: any) => {
    setTodos((prev) => {
      const { parent, key } = item;
      const newPos = Object.keys(prev[to].todo).length;
      const newId = new Date().getTime();
      const newItem = {
        [newId]: {
          ...prev[parent].todo[key],
          pos: newPos,
        },
      };
      const newList = {
        ...prev,
        [to]: {
          ...prev[to],
          todo: {
            ...prev[to].todo,
            ...newItem,
          },
        },
      };
      return newList;
    });
  };
  return (
    <TodoListContext.Provider value={{ todos, addTodo, moveTodo }}>
      {children}
    </TodoListContext.Provider>
  );
};
