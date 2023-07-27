export type Todo = {
  pos: number;
  text: string;
};

export type TodoList = {
  todo: Todo[];
  name: string;
  color: string;
  pos: number;
};
