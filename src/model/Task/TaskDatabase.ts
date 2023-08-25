interface TaskEntity {
  id: string;
  text: string;
  columnId: string;
  position: number;
}

export const taskDatabase = new Map<string, TaskEntity>();
