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

    return {
      credentialID: verification.registrationInfo.credentialID,
      credentialPublicKey: verification.registrationInfo.credentialPublicKey,
      counter: verification.registrationInfo.counter,
      credentialDeviceType: verification.registrationInfo.credentialDeviceType,
      credentialBackedUp: verification.registrationInfo.credentialBackedUp,
      userId,
    };
  }

  public get tableName() {
    return "authenticators";
  }

  public get entityName() {
    return "Authenticator";
  }

  private queryByCredentialId = this.mapper.mapWithQuery(
    `SELECT * FROM ${this.tableName} WHERE user_id = ?`,
    (doc: { userId: string }) => [doc.userId],
  );

  async listByUserId(userId: string) {
    const result = await this.queryByCredentialId({ userId });
    return result.toArray();
  }
}
