import { Client } from "cassandra-driver";

const contactPoints = (process.env.CASSANDRA_HOSTS ?? "127.0.0.1").split(",");
const keyspace = process.env.CASSANDRA_KEYSPACE ?? "tasks";
const localDataCenter = process.env.CASSANDRA_LOCAL_DATACENTER ?? "datacenter1";

export const client = new Client({
  contactPoints,
  localDataCenter,
  keyspace,
});

client.connect();
