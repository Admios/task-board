import { cassandraClient } from "@/cassandra";

export interface TaskEntity {
  id: string;
  text: string;
  columnId: string;
  position: number;
}

const taskSchema = {
  fields: {
    id: {
      type: "uuid",
      default: { $db_function: "uuid()" },
    },
    text: "text",
    columnId: "text",
    position: "int",
  },
  key: ["id"],
};

export const TaskModel = cassandraClient.model("Task", taskSchema);

TaskModel.syncDB();
