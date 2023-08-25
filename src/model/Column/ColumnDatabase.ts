interface ColumnEntity {
  id: string;
  name: string;
  position: number;
  color: string;
}

export const columnDatabase = new Map<string, ColumnEntity>();
