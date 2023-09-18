import { Client, mapping } from "cassandra-driver";

const contactPoints = (process.env.CASSANDRA_HOSTS ?? "127.0.0.1").split(",");
const keyspace = process.env.CASSANDRA_KEYSPACE ?? "tasks";
const localDataCenter = process.env.CASSANDRA_LOCAL_DATACENTER ?? "datacenter1";

export const client = new Client({
  contactPoints,
  localDataCenter,
  keyspace,
});

export const mapper = new mapping.Mapper(client, {
  models: {
    Column: {
      tables: ["columns"],
      mappings: new mapping.UnderscoreCqlToCamelCaseMappings(),
    },
    Task: {
      tables: ["tasks"],
      mappings: new mapping.UnderscoreCqlToCamelCaseMappings(),
    },
    User: {
      tables: ["users"],
      mappings: new mapping.UnderscoreCqlToCamelCaseMappings(),
    },
    Authenticator: {
      tables: ["authenticators"],
      mappings: new mapping.UnderscoreCqlToCamelCaseMappings(),
    },
  },
});

client.connect();
