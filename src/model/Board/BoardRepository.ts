import { BaseRepository } from "@/model/BaseRepository";
import { BoardDTO } from "@/model/Board";
import { defineColumns } from "@/model/columns";

export class BoardRepository extends BaseRepository<BoardDTO> {
  constructor() {
    super({
      tableName: "boards",
      entityName: "Board",
      columns: defineColumns<BoardDTO>({ id: true, name: true, owner: true }),
    });
  }

  listByUserId(userId: string) {
    return this.query(`SELECT * FROM "${this.tableName}" WHERE "owner" = ?`, userId);
  }
}
