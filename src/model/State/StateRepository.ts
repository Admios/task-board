import { BaseRepository } from "@/model/BaseRepository";
import { StateDTO } from "@/model/State";

export class StateRepository extends BaseRepository<StateDTO> {
  public get tableName() {
    return "states";
  }

  public get entityName() {
    return "State";
  }

  private readonly queryByBoardId = this.mapper.mapWithQuery(
    `SELECT * FROM ${this.tableName} WHERE board_id = ?`,
    (doc: { id: string }) => [doc.id],
  );

  async listByBoardId(boardId: string) {
    const result = await this.queryByBoardId({ id: boardId });
    return result.toArray();
  }
}
