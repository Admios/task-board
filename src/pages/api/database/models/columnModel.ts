import models from "../cassandra";

const ColumnSchema = {
  fields: {
    id: 'text',
    name: 'text',
    position: 'int',
    color: 'text',
  },
  key: ['id'],
};

const ColumnsModel = models.loadSchema('columns', ColumnSchema);

ColumnsModel.syncDB((err: any, result: any) => {
  if (err) throw err;
});
