import { BaseRepository } from "@/model/BaseRepository";
import { AuthenticationChallengeDTO } from "./AuthenticationChallengeDTO";

export class AuthenticationChallengeRepository extends BaseRepository<AuthenticationChallengeDTO> {
  get tableName() {
    return "authentication_challenges";
  }
  get entityName() {
    return "AuthenticationChallenge";
  }
}
