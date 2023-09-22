import { BaseRepository } from "@/model/BaseRepository";
import { ColumnDTO } from "@/model/Column";

export class ColumnRepository extends BaseRepository<ColumnDTO> {
  public get tableName() {
    return "columns";
  }

  public get entityName() {
    return "Column";
  }
}
