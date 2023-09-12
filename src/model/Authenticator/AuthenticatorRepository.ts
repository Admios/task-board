import { Authenticator } from "@/model/types";
import { AbstractRepository } from "@/model/AbstractRepository";
import { AuthenticatorEntity, AuthenticatorModel } from "./AuthenticatorEntity";

export class AuthenticatorRepository extends AbstractRepository<Authenticator> {
  protected getEntity() {
    return AuthenticatorModel;
  }

  protected getEntityName() {
    return "Authenticator";
  }

  protected convertEntityToModel(entity: AuthenticatorEntity) {
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

  protected convertModelToEntity(model: Authenticator) {
    return {
      id: Buffer.from(model.credentialID).toString("base64url"),
      credentialPublicKey: Buffer.from(model.credentialPublicKey).toString(
        "base64url",
      ),
      counter: model.counter,
      credentialDeviceType: model.credentialDeviceType,
      credentialBackedUp: model.credentialBackedUp,
      transports: model.transports?.join(","),
      userId: model.userId,
    };
  }

  async seed() {}

  listByUserId(userId: string): Promise<Authenticator[]> {
    return new Promise<Authenticator[]>((resolve, reject) => {
      this.getEntity().find(
        { userId },
        (err: unknown, result: AuthenticatorEntity[]) => {
          if (err || !result) {
            reject(err);
          }

          resolve(result.map((item) => this.convertEntityToModel(item)));
        },
      );
    });
  }
}
