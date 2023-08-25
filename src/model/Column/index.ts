import { AbstractRepository } from "@/model/AbstractRepository";

export interface ColumnEntity {
  id: string;
  name: string;
  position: number;
  color: string;
}

const columnDatabase: ColumnEntity[] = [];

export class ColumnRepository implements AbstractRepository<ColumnEntity> {
  constructor() {}

  async findById(id: string) {
    const item = columnDatabase.find((c) => c.id === id);

    if (!item) {
      throw new Error("Column not found");
    }

    return item;
  }

  async list() {
    return columnDatabase;
  }

  async create(column: ColumnEntity) {
    columnDatabase.push(column);
    return column;
  }

  async update(column: ColumnEntity) {
    const index = columnDatabase.findIndex((c) => c.id === column.id);
    columnDatabase[index] = column;
    return column;
  }

  async delete(column: ColumnEntity) {
    const index = columnDatabase.findIndex((c) => c.id === column.id);
    columnDatabase.splice(index, 1);
    return column;
  }
}
