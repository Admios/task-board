import { DefaultColumnId } from "@/model/types";
import { v4 as uuid } from "uuid";

interface TaskEntity {
  id: string;
  text: string;
  columnId: string;
  position: number;
}

export const taskDatabase = new Map<string, TaskEntity>();

["Task 17", "Task 28", "Task 39"].forEach((text, index) => {
  const id = uuid();
  taskDatabase.set(id, {
    id,
    text,
    columnId: DefaultColumnId.NEW,
    position: index,
  });
});

["Task 45", "Task 56"].forEach((text, index) => {
  const id = uuid();
  taskDatabase.set(id, {
    id,
    text,
    columnId: DefaultColumnId.IN_PROGRESS,
    position: index,
  });
});

["Task 87", "Task 29", "Task 63", "Task 4"].forEach((text, index) => {
  const id = uuid();
  taskDatabase.set(id, {
    id,
    text,
    columnId: DefaultColumnId.IN_REVIEW,
    position: index,
  });
});

["Task 7", "Task 8", "Task 9"].forEach((text, index) => {
  const id = uuid();
  taskDatabase.set(id, {
    id,
    text,
    columnId: DefaultColumnId.DONE,
    position: index,
  });
});
