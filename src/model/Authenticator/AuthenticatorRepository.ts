import { BaseRepository } from "@/model/BaseRepository";
import { defineColumns } from "@/model/columns";
import { type SqlValue } from "@/model/SqliteClient";
import { type VerifiedRegistrationResponse } from "@simplewebauthn/server";
import { type AuthenticatorDTO } from "./AuthenticatorDTO";

/**
 * The literal shape stored in/read from the `authenticators` table — as
 * opposed to `AuthenticatorDTO`, which is what the rest of the app works
 * with. Naming this lets `toRow`/`fromRow` below read and write named,
 * typed fields instead of casting each one out of an untyped row.
 */
interface AuthenticatorRow extends Record<string, SqlValue> {
  credentialID: string;
  credentialPublicKey: Uint8Array;
  counter: number;
  credentialDeviceType: string;
  credentialBackedUp: number;
  transports: string | null;
  userId: string;
}

export class AuthenticatorRepository extends BaseRepository<
  AuthenticatorDTO,
  AuthenticatorRow
> {
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

  constructor() {
    super({
      tableName: "authenticators",
      entityName: "Authenticator",
      columns: defineColumns<AuthenticatorDTO>({
        credentialID: true,
        credentialPublicKey: true,
        counter: true,
        credentialDeviceType: true,
        credentialBackedUp: true,
        transports: true,
        userId: true,
      }),
      idColumn: "credentialID",
    });
  }

  protected override toRow(entity: AuthenticatorDTO): AuthenticatorRow {
    return {
      credentialID: entity.credentialID,
      credentialPublicKey: new Uint8Array(entity.credentialPublicKey),
      counter: entity.counter,
      credentialDeviceType: entity.credentialDeviceType,
      credentialBackedUp: entity.credentialBackedUp ? 1 : 0,
      transports: entity.transports?.length
        ? entity.transports.join(",")
        : null,
      userId: entity.userId,
    };
  }

  protected override fromRow(row: AuthenticatorRow): AuthenticatorDTO {
    return {
      credentialID: row.credentialID,
      credentialPublicKey: new Uint8Array(row.credentialPublicKey),
      counter: row.counter,
      credentialDeviceType: row.credentialDeviceType,
      credentialBackedUp: Boolean(row.credentialBackedUp),
      // Reading the column back only proves it's a string, not that it's a
      // valid AuthenticatorTransport — that's an honest, irreducible cast:
      // no amount of typing the row shape can verify data we wrote earlier
      // still matches the union without a runtime check.
      transports: row.transports
        ? (row.transports.split(",") as AuthenticatorTransport[])
        : [],
      userId: row.userId,
    };
  }

  listByUserId(userId: string) {
    return this.query(
      `SELECT * FROM "${this.tableName}" WHERE "userId" = ?`,
      userId,
    );
  }
}
