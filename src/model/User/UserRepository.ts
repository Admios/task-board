import { BaseRepository } from "@/model/BaseRepository";
import { defineColumns } from "@/model/columns";
import { UserDTO } from "./UserDTO";

export class UserRepository extends BaseRepository<UserDTO> {
  readonly tableName = "users";
  readonly entityName = "User";
  readonly columns = defineColumns<UserDTO>({ email: true });
  override readonly idColumn = "email";
}
