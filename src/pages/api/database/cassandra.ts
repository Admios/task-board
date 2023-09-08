const ExpressCassandra = require("express-cassandra");

const models = ExpressCassandra.createClient({
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

export default models;
