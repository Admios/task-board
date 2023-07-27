import React from "react";
import { v4 as uuidv4 } from "uuid";
import { createContext, useContext, useState, useEffect } from "react";
import { TodoList } from "../types";

interface TodoListInterface {
  todos: TodoList;
  addTodo: (task: string, column: string) => void;
  moveTodo: (to: string, item: any) => void;
  addRandomTodos: (amount: number) => void;
}

const newCol = {
  New: {
    pos: 0,
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

const inProgressCol = {
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
};

const reviewCol = {
  Review: {
    pos: 2,
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
};

const doneCol = {
  Done: {
    pos: 3,
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
};

const TodoListContext = createContext<TodoListInterface>({
  todos: {},
  addTodo: () => void 0,
  moveTodo: () => void 0,
  addRandomTodos: () => void 0,
});

export const useTodoList = () => useContext(TodoListContext);

export const TodoListContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // const [todos, setTodos] = useState<TodoList>(mockData);
  const [newTodos, setNewTodos] = useState<TodoList>(newCol);
  const [inProgressTodos, setInProgressTodos] =
    useState<TodoList>(inProgressCol);
  const [reviewTodos, setReviewTodos] = useState<TodoList>(reviewCol);
  const [doneTodos, setDoneTodos] = useState<TodoList>(doneCol);

  const addTodo = (task: string, column: string) => {
    const id = uuidv4();
    switch (column) {
      case "New":
        setNewTodos((prev) => {
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
        break;
      case "In Progress":
        setInProgressTodos((prev) => {
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
      default:
        break;
    }
  };

  const moveTodo = (to: string, item: any) => {
    setTodos((prev) => {
      const { parent, key } = item;
      const newPos = Object.keys(prev[to].todo).length;
      const newId = uuidv4();
      const newItem = {
        [newId]: {
          ...prev[parent].todo[key],
          pos: newPos,
        },
      };
      delete prev[item.parent].todo[key];
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

  const addRandomTodos = (amount: number) => {
    if (amount < 1) {
      alert("Please enter a number greater than 0");
      return;
    }
    const todosKeys = Object.keys(todos);
    for (let i = 0; i < amount; i++) {
      const randomParent =
        todosKeys[Math.floor(Math.random() * todosKeys.length)];
      addTodo(`Task ${i}`, randomParent);
    }
  };
  return (
    <TodoListContext.Provider
      value={{ todos, addTodo, moveTodo, addRandomTodos }}
    >
      {children}
    </TodoListContext.Provider>
  );
};
