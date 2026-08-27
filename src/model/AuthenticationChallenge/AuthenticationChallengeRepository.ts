import { BaseRepository } from "@/model/BaseRepository";
import { defineColumns } from "@/model/columns";
import { AuthenticationChallengeDTO } from "./AuthenticationChallengeDTO";

export class AuthenticationChallengeRepository extends BaseRepository<AuthenticationChallengeDTO> {
  constructor() {
    super({
      tableName: "authentication_challenges",
      entityName: "AuthenticationChallenge",
      columns: defineColumns<AuthenticationChallengeDTO>({ id: true, challenge: true }),
    });
  }
}
