const ExpressCassandra = require("express-cassandra");

const contactPoints = (process.env.CASSANDRA_HOSTS ?? "localhost").split(",");
const keyspace = process.env.CASSANDRA_KEYSPACE ?? "tasks";
const localDataCenter = process.env.CASSANDRA_LOCAL_DATACENTER ?? "localhost";

export const cassandraClient = ExpressCassandra.createClient({
  clientOptions: {
    contactPoints,
    protocolOptions: { port: 9042 },
    keyspace,
    localDataCenter,
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
