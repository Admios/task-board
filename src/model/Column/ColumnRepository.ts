import { AbstractRepository, Column } from "@/model/types";
import { columnDatabase } from "./ColumnDatabase";

export class ColumnRepository implements AbstractRepository<Column> {
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

  async create(column: Column) {
    columnDatabase.set(column.id, column);
    return column;
  }

  async update(id: string, column: Column) {
    columnDatabase.set(id, column);
    return column;
  }

  async delete(id: string) {
    columnDatabase.delete(id);
  }
}
