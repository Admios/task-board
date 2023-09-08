export interface Column {
  id: string;
  name: string;
  position: number;
  color: string;
}

export const ColumnSchema = {
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



