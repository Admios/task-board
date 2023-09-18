import { AbstractRepository } from "@/model/AbstractRepository";
import { client, mapper } from "@/model/CassandraClient";
import { AuthenticatorDTO } from "./AuthenticatorDTO";
import { AuthenticatorEntity } from "./AuthenticatorEntity";

export class AuthenticatorRepository extends AbstractRepository<
  AuthenticatorDTO,
  AuthenticatorEntity
> {
  public get tableName() {
    return "authenticators";
  }

  public get entityName() {
    return "Authenticator";
  }

  public get mapper() {
    return mapper.forModel<AuthenticatorEntity>(this.entityName);
  }

  protected convertEntityToDTO(entity: AuthenticatorEntity): AuthenticatorDTO {
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

  async createTable() {
    return client.execute(
      `CREATE TABLE IF NOT EXISTS ${this.tableName} (id text, credential_public_key text, counter int, credential_device_type text, credential_backed_up boolean, transports text, user_id text, PRIMARY KEY (id))`,
    );
  }

  async listByUserId(userId: string) {
    const result = await this.mapper.find({ userId });
    return result.toArray().map((row) => this.convertEntityToDTO(row));
  }
}
