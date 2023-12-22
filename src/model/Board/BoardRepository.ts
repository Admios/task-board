import { BaseRepository } from "@/model/BaseRepository";
import { BoardDTO } from "@/model/Board";

export class BoardRepository extends BaseRepository<BoardDTO> {
  public get tableName() {
    return "boards";
  }

  public get entityName() {
    return "Board";
  }

  async listByUserId(userId: string) {
    const query = this.mapper.mapWithQuery(
      `SELECT * FROM ${this.tableName} WHERE owner = ?`,
      (doc: { id: string }) => [doc.id],
    );
    const result = await query({ id: userId });
    return result.toArray();
  }
}
