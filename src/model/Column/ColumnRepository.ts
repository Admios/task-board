import { BaseRepository } from "@/model/BaseRepository";
import { ColumnDTO } from "@/model/Column";

export class ColumnRepository extends BaseRepository<ColumnDTO> {
  public get tableName() {
    return "columns";
  }

  public get entityName() {
    return "Column";
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
