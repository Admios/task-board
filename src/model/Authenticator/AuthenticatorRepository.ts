import { AbstractRepository, Authenticator } from "@/model/types";
import { authenticatorDatabase } from "./AuthenticatorDatabase";

export class AuthenticatorRepository
  implements AbstractRepository<Authenticator>
{
  async findById(id: string): Promise<Authenticator> {
    const item = authenticatorDatabase.get(id);
    if (!item) {
      throw new Error("Authenticator not found");
    }
    return item;
  }

  async findByCredentialId(credentialId: Buffer): Promise<Authenticator> {
    // NOTE: credentialID is stored as binary.
    const item = Array.from(authenticatorDatabase.values()).find(
      (authenticator) => credentialId.compare(authenticator.credentialID) === 0,
    );

    if (!item) {
      throw new Error("Authenticator not found");
    }

    return item;
  }

  async list(): Promise<Authenticator[]> {
    return Array.from(authenticatorDatabase.values());
  }

  async listByUserId(userId: string): Promise<Authenticator[]> {
    return Array.from(authenticatorDatabase.values()).filter(
      (authenticator) => authenticator.userId === userId,
    );
  }

  async create(authenticator: Authenticator): Promise<Authenticator> {
    authenticatorDatabase.set(authenticator.id, authenticator);
    return authenticator;
  }

  async update(id: string, authenticator: Authenticator) {
    authenticatorDatabase.set(id, authenticator);
    return authenticator;
  }

  async delete(id: string) {
    authenticatorDatabase.delete(id);
  }

  async truncate() {
    authenticatorDatabase.clear();
  }
}
