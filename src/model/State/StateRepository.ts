import { BaseRepository } from "@/model/BaseRepository";
import { StateDTO } from "@/model/State";
import { defineColumns } from "@/model/columns";

export class StateRepository extends BaseRepository<StateDTO> {
  readonly tableName = "states";
  readonly entityName = "State";
  readonly columns = defineColumns<StateDTO>({
    id: true,
    name: true,
    boardId: true,
    position: true,
    color: true,
  });

  listByBoardId(boardId: string) {
    return this.query(`SELECT * FROM "${this.tableName}" WHERE "boardId" = ?`, boardId);
  }
}
