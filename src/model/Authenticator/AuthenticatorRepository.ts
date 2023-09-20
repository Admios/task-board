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
    return client.execute(
      `CREATE TABLE IF NOT EXISTS ${this.tableName} (id text, credential_public_key blob, counter int, credential_device_type text, credential_backed_up boolean, transports set<varchar>, user_id text, PRIMARY KEY (id))`,
    );
  }

  async listByUserId(userId: string) {
    const result = await this.mapper.find({ userId });
    return result.toArray();
  }
}
