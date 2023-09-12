import { AbstractRepository } from "@/model/AbstractRepository";
import { Column, DefaultColumnId } from "@/model/types";
import { ColumnEntity, ColumnModel } from "./ColumnEntity";

export class ColumnRepository extends AbstractRepository<Column> {
  protected getEntity() {
    return ColumnModel;
  }

  protected getEntityName() {
    return "Column";
  }

  protected convertEntityToModel(entity: ColumnEntity): Column {
    return entity;
  }

  protected convertModelToEntity(model: Column): ColumnEntity {
    return model;
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
