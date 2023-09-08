import { ColumnModel } from "../database/cassandra";
import { BaseRepository } from "./baseRepository";

class ColumnRepository extends BaseRepository<typeof ColumnModel> {
    constructor() {
        super(ColumnModel);
    }
}

export default ColumnRepository;
