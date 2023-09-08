export interface Todo {
  id: string;
  columnId: string;
  text: string;
}

export interface Column {
  id: string;
  name: string;
  position: number;
  color: string;
}
