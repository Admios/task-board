import { client } from "@/model/CassandraClient";
import { AbstractRepository } from "@/model/AbstractRepository";
import { AuthenticatorDTO } from "./AuthenticatorDTO";
import { types } from "cassandra-driver";

export class AuthenticatorRepository extends AbstractRepository<AuthenticatorDTO> {
  public get tableName() {
    return "authenticators";
  }

  public get entityName() {
    return "Authenticator";
  }

  protected convertEntityToDTO(entity: types.Row): AuthenticatorDTO {
    return {
      credentialID: Buffer.from(entity.id, "base64url"),
      credentialPublicKey: Buffer.from(entity.credentialPublicKey, "base64url"),
      counter: entity.counter,
      credentialDeviceType: entity.credentialDeviceType,
      credentialBackedUp: entity.credentialBackedUp,
      transports: entity.transports?.split(",") as AuthenticatorTransport[],
      userId: entity.userId,
    };
  }

  async seed() {}

  async createTable() {
    return client.execute(
      `CREATE TABLE IF NOT EXISTS ${this.tableName} (id text, credentialPublicKey text, counter int, credentialDeviceType text, credentialBackedUp boolean, transports text, userId text, PRIMARY KEY (id))`,
    );
  }

  async listByUserId(userId: string) {
    const query = await client.execute("SELECT * FROM ? WHERE userId = ?", [
      this.tableName,
      userId,
    ]);

    return query.rows.map((row) => this.convertEntityToDTO(row));
  }
}
