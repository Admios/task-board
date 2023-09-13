import cassandra from "cassandra-driver";

const contactPoints = (process.env.CASSANDRA_HOSTS ?? "localhost").split(",");
const keyspace = process.env.CASSANDRA_KEYSPACE ?? "tasks";
const localDataCenter = process.env.CASSANDRA_LOCAL_DATACENTER ?? "localhost";

export const client = new cassandra.Client({
  contactPoints,
  localDataCenter,
  keyspace,
});
