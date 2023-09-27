export interface Todo {
  id: string;
  columnId: string;
  text: string;
  position: number;
}

export interface Column {
  id: string;
  name: string;
  position: number;
  color: string;
}
