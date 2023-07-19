export type Todo = {
  [key: string]: {
    pos: number;
    text: string;
  };
};

export type TodoList = {
  [key: string]: {
    todo: Todo;
    color: string;
    pos: number;
  };
};
