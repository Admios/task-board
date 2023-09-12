import { cassandraClient } from "@/cassandra";

export interface ColumnEntity {
  id: string;
  name: string;
  position: number;
  color: string;
}

const columnSchema = {
  fields: {
    id: {
      type: "uuid",
      default: { $db_function: "uuid()" },
    },
    name: "text",
    position: "int",
    color: "text",
  },
  key: ["id"],
};

export const ColumnModel = cassandraClient.model("Column", columnSchema);

ColumnModel.syncDB();
