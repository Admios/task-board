export interface ColumnDTO {
  id: string;
  name: string;
  position: number;
  color: string;
}

export enum DefaultColumnId {
  NEW = "new",
  IN_PROGRESS = "inProgress",
  IN_REVIEW = "inReview",
  DONE = "done",
}
