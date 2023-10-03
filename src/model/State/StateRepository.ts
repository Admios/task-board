import { BaseRepository } from "@/model/BaseRepository";
import { StateDTO } from "@/model/State";

export class StateRepository extends BaseRepository<StateDTO> {
  public get tableName() {
    return "states";
  }

  public get entityName() {
    return "State";
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
