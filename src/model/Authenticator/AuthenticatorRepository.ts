import { client } from "@/model/CassandraClient";
import { AbstractRepository } from "@/model/AbstractRepository";
import { AuthenticatorDTO } from "./AuthenticatorDTO";
import { types } from "cassandra-driver";

export class AuthenticatorRepository extends AbstractRepository<AuthenticatorDTO> {
  protected get tableName() {
    return "authenticators";
  }

  protected get entityName() {
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

  async listByUserId(userId: string) {
    const query = await client.execute("SELECT * FROM ? WHERE userId = ?", [
      this.tableName,
      userId,
    ]);

    return query.rows.map((row) => this.convertEntityToDTO(row));
  }
}
