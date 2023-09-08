export interface Task {
  id: string;
  text: string;
  columnId: string;
  position: number;
}

export const TaskSchema = {
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