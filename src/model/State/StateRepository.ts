import { BaseRepository } from "@/model/BaseRepository";
import { StateDTO } from "@/model/State";

export class StateRepository extends BaseRepository<StateDTO> {
  public get tableName() {
    return "states";
  }

  public get entityName() {
    return "State";
  }

  async listByBoardId(boardId: string) {
    const query = this.mapper.mapWithQuery(
      `SELECT * FROM ${this.tableName} WHERE board_id = ?`,
      (doc: { id: string }) => [doc.id],
    );
    const result = await query({ id: boardId });
    return result.toArray();
  }
}
