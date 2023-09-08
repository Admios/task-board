import { ColumnSchema } from "../models/column";
import { TaskSchema } from "../models/task";

const ExpressCassandra = require("express-cassandra");

const cassandraClient = ExpressCassandra.createClient({
  clientOptions: {
    contactPoints: ["localhost"],
    protocolOptions: { port: 9042 },
    keyspace: "mi_keyspace",
    localDataCenter: "datacenter1",
    queryOptions: { consistency: ExpressCassandra.consistencies.one },
  },
  ormOptions: {
    defaultReplicationStrategy: {
      class: "SimpleStrategy",
      replication_factor: 1,
    },
    migration: "safe",
    createKeyspace: true,
    dropTableOnSchemaChange: false,
  },
});


export const ColumnModel = cassandraClient.loadSchema("columns", ColumnSchema);
export const TaskModel = cassandraClient.loadSchema("tasks", TaskSchema);

[ColumnModel, TaskModel].forEach((model: any) => {
  model.syncDB((err: any) => {
    if (err) throw err;
  });
});

export default cassandraClient;
