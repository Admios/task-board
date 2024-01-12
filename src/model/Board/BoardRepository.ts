import { BaseRepository } from "@/model/BaseRepository";
import { BoardDTO } from "@/model/Board";

export class BoardRepository extends BaseRepository<BoardDTO> {
  public get tableName() {
    return "boards";
  }

  public get entityName() {
    return "Board";
  }

  private readonly queryByOwner = this.mapper.mapWithQuery(
    `SELECT * FROM ${this.tableName} WHERE owner = ?`,
    (doc: { id: string }) => [doc.id],
  );

  async listByUserId(userId: string) {
    const result = await this.queryByOwner({ id: userId });
    return result.toArray();
  }
}
