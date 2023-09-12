import { AbstractRepository, Column, DefaultColumnId } from "@/model/types";
import { ColumnModel, ColumnEntity } from "./ColumnEntity";

export class ColumnRepository implements AbstractRepository<Column> {
  async findById(id: string) {
    return new Promise<Column>((resolve, reject) => {
      ColumnModel.find(
        { id, $limit: 1 },
        (err: unknown, result: ColumnEntity[]) => {
          if (err || !result) {
            reject(err);
          }

          if (result.length < 1) {
            reject(new Error("Column not found"));
          }

          resolve(result[0]);
        },
      );
    });
  }

  async list() {
    return new Promise<Column[]>((resolve, reject) => {
      ColumnModel.find({}, (err: unknown, result: ColumnEntity[]) => {
        if (err || !result) {
          reject(err);
        }

        resolve(result);
      });
    });
  }

  async create(column: Column) {
    return new Promise<Column>((resolve, reject) => {
      const newColumn = new ColumnModel({
        name: column.name,
        position: column.position,
        color: column.color,
      });

      newColumn.save((err: unknown, result: ColumnEntity) => {
        if (err || !result) {
          reject(err);
        }

        resolve(result);
      });
    });
  }

  async update(id: string, column: Column) {
    return new Promise<Column>((resolve, reject) => {
      const newColumn = new ColumnModel({
        ...column,
        id,
      });

      newColumn.update(
        { id },
        { column },
        (err: unknown, result: ColumnEntity) => {
          if (err || !result) {
            reject(err);
          }

          resolve(result);
        },
      );
    });
  }

  async delete(id: string) {
    return new Promise<void>((resolve, reject) => {
      ColumnModel.delete({ id }, (err: unknown) => {
        if (err) {
          reject(err);
        }

        resolve();
      });
    });
  }

  async truncate() {
    return new Promise<void>((resolve, reject) => {
      ColumnModel.truncate({}, (err: unknown) => {
        if (err) {
          reject(err);
        }

        resolve();
      });
    });
  }

  /** TODO: this should be outside. */
  async seed() {
    return Promise.all([
      this.create({
        id: DefaultColumnId.NEW,
        name: "New",
        position: 0,
        color: "black",
      }),

      this.create({
        id: DefaultColumnId.IN_PROGRESS,
        name: "In Progress",
        position: 1,
        color: "orange",
      }),

      this.create({
        id: DefaultColumnId.IN_REVIEW,
        name: "In Review",
        position: 2,
        color: "green",
      }),

      this.create({
        id: DefaultColumnId.DONE,
        name: "Done",
        position: 3,
        color: "blue",
      }),
    ]);
  }
}
