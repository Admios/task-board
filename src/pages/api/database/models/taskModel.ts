import models from "../cassandra";

const TaskSchema = {
  fields: {
    id: "text",
    text: "text",
    columnId: "text",
    position: "int",
  },
  key: ["id"],
};

const TaskModel = models.loadSchema("tasks", TaskSchema);

TaskModel.syncDB((err: any, result: any) => {
  if (err) throw err;
});
