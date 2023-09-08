const cassandra = require("express-cassandra");

let cassandraClient: any = null;

function initializeCassandra() {
  if (!cassandraClient) {
    cassandraClient = cassandra.createClient({
      clientOptions: {
        contactPoints: ["localhost"],
        protocolOptions: { port: 9042 },
        keyspace: "mi_keyspace",
        localDataCenter: "datacenter1",
        queryOptions: { consistency: cassandra.consistencies.one },
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
  }

  return cassandraClient;
}

export default initializeCassandra;
