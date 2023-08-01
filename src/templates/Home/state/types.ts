export interface Todo {
  id: string;
  text: string;
}

export type ColumnId =
  | "columnNew"
  | "columnInProgress"
  | "columnReview"
  | "columnDone";

export interface Column {
  id: ColumnId;
  name: string;
  position: number;
  color: string;
}
