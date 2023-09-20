import { AbstractRepository } from "@/model/AbstractRepository";
import { client } from "@/model/CassandraClient";
import { AuthenticatorDTO } from "./AuthenticatorDTO";

export class AuthenticatorRepository extends AbstractRepository<AuthenticatorDTO> {
  public get tableName() {
    return "authenticators";
  }

  public get entityName() {
    return "Authenticator";
  }

  async createTable() {
    await client.execute(
      `CREATE TABLE IF NOT EXISTS ${this.tableName} (
        id text,
        credential_public_key text,
        counter int,
        credential_device_type text,
        credential_backed_up boolean,
        transports set<varchar>,
        user_id text,
        PRIMARY KEY (id)
      )`,
    );

    await client.execute(
      `CREATE INDEX idx_${this.tableName}_user_id ON ${this.tableName} (user_id)`,
    );
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
