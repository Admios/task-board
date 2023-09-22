import { BaseRepository } from "@/model/BaseRepository";
import { UserDTO } from "./UserDTO";

export class UserRepository extends BaseRepository<UserDTO> {
  public get tableName() {
    return "users";
  }

  public get entityName() {
    return "User";
  }
}
