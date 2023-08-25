import { AbstractRepository } from "@/model/AbstractRepository";

export interface ColumnEntity {
  id: string;
  name: string;
  position: number;
  color: string;
}

const columnDatabase = new Map<string, ColumnEntity>();

export class ColumnRepository implements AbstractRepository<ColumnEntity> {
  async findById(id: string) {
    const item = columnDatabase.get(id);
    if (!item) {
      throw new Error("Column not found");
    }

    return item;
  }

  async list() {
    return Array.from(columnDatabase.values());
  }

  async create(column: ColumnEntity) {
    columnDatabase.set(column.id, column);
    return column;
  }

  async update(id: string, column: ColumnEntity) {
    columnDatabase.set(id, column);
    return column;
  }

  async delete(id: string) {
    columnDatabase.delete(id);
  }
}
