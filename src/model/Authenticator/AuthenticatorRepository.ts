import { BaseRepository } from "@/model/BaseRepository";
import { VerifiedRegistrationResponse } from "@simplewebauthn/server";
import { AuthenticatorDTO } from "./AuthenticatorDTO";

export class AuthenticatorRepository extends BaseRepository<AuthenticatorDTO> {
  static fromRegistration(
    userId: string,
    verification: VerifiedRegistrationResponse,
  ): AuthenticatorDTO {
    if (!verification.registrationInfo) {
      throw new Error("Registration has no verification info");
    }

    const { credential, credentialDeviceType, credentialBackedUp } =
      verification.registrationInfo;

    return {
      credentialID: credential.id,
      credentialPublicKey: credential.publicKey,
      counter: credential.counter,
      credentialDeviceType,
      credentialBackedUp,
      userId,
    };
  }

  public get tableName() {
    return "authenticators";
  }

  public get entityName() {
    return "Authenticator";
  }

  readonly queryByUserId = this.mapper.mapWithQuery(
    `SELECT * FROM ${this.tableName} WHERE user_id = ?`,
    (doc: { userId: string }) => [doc.userId],
  );

  async listByUserId(userId: string) {
    const result = await this.queryByUserId({ userId });
    return result.toArray();
  }
}
