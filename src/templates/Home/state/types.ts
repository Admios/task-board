export interface Todo {
  id: string;
  columnId: string;
  text: string;
  position: number;
  owner: string;
}

export interface Column {
  id: string;
  name: string;
  position: number;
  color: string;
  owner: string;
}
