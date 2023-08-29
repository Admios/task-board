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

export interface AbstractRepository<ReturnType> {
  findById(id: string): Promise<ReturnType>;
  list(): Promise<ReturnType[]>;
  create(entity: ReturnType): Promise<ReturnType>;
  update(id: string, entity: ReturnType): Promise<ReturnType>;
  delete(id: string): Promise<void>;
}

export enum DefaultColumnId {
  NEW = "new",
  IN_PROGRESS = "inProgress",
  IN_REVIEW = "inReview",
  DONE = "done",
}
