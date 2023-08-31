export interface Todo {
  id: string;
  backendId: string | null;
  columnId: string;
  text: string;
}

export interface Column {
  id: string;
  backendId: string | null;
  name: string;
  position: number;
  color: string;
}
