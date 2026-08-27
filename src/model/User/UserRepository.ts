import { BaseRepository } from "@/model/BaseRepository";
import { defineColumns } from "@/model/columns";
import { UserDTO } from "./UserDTO";

export class UserRepository extends BaseRepository<UserDTO> {
  constructor() {
    super({
      tableName: "users",
      entityName: "User",
      columns: defineColumns<UserDTO>({ email: true }),
      idColumn: "email",
    });
  }
}
