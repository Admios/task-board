import { DefaultColumnId } from "@/model/types";

interface ColumnEntity {
  id: string;
  name: string;
  position: number;
  color: string;
}

export const columnDatabase = new Map<string, ColumnEntity>();

columnDatabase.set(DefaultColumnId.NEW, {
  id: DefaultColumnId.NEW,
  name: "New",
  position: 0,
  color: "black",
});

columnDatabase.set(DefaultColumnId.IN_PROGRESS, {
  id: DefaultColumnId.IN_PROGRESS,
  name: "In Progress",
  position: 1,
  color: "orange",
});

columnDatabase.set(DefaultColumnId.IN_REVIEW, {
  id: DefaultColumnId.IN_REVIEW,
  name: "In Review",
  position: 2,
  color: "green",
});

columnDatabase.set(DefaultColumnId.DONE, {
  id: DefaultColumnId.DONE,
  name: "Done",
  position: 3,
  color: "blue",
});
