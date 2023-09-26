import { BaseRepository } from "@/model/BaseRepository";
import { AuthenticatorDTO } from "./AuthenticatorDTO";

export class AuthenticatorRepository extends BaseRepository<AuthenticatorDTO> {
  public get tableName() {
    return "authenticators";
  }

  public get entityName() {
    return "Authenticator";
  }

  async listByUserId(userId: string) {
    // TODO: Use a Materialized View instead of a secondary index
    const query = this.mapper.mapWithQuery(
      `SELECT * FROM ${this.tableName} WHERE user_id = ?`,
      (doc: { id: string }) => [doc.id],
    );
    const result = await query({ id: userId });
    return result.toArray();
  }
}
