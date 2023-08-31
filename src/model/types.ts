export interface Column {
  id: string;
  name: string;
  position: number;
  color: string;
}

export interface Task {
  id: string;
  text: string;
  columnId: string;
  position: number;
}

export interface AbstractRepository<T> {
  findById(id: string): Promise<T>;
  list(): Promise<T[]>;
  create(input: T): Promise<T>;
  update(id: string, input: T): Promise<T>;
  delete(id: string): Promise<void>;
}

export enum DefaultColumnId {
  NEW = "new",
  IN_PROGRESS = "inProgress",
  IN_REVIEW = "inReview",
  DONE = "done",
}
