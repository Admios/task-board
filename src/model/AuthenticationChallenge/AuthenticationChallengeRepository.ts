import { BaseRepository } from "@/model/BaseRepository";
import { defineColumns } from "@/model/columns";
import { AuthenticationChallengeDTO } from "./AuthenticationChallengeDTO";

export class AuthenticationChallengeRepository extends BaseRepository<AuthenticationChallengeDTO> {
  readonly tableName = "authentication_challenges";
  readonly entityName = "AuthenticationChallenge";
  readonly columns = defineColumns<AuthenticationChallengeDTO>({ id: true, challenge: true });
}
