import { Client } from "cassandra-driver";
import { loadEnvConfig } from "@next/env";

const result = loadEnvConfig("./");
console.log(
  "Loaded Env Files: ",
  result.loadedEnvFiles.map((file) => file.path),
);

const keyspace = process.env.CASSANDRA_KEYSPACE;
const keystoreClient = new Client({
  contactPoints: (process.env.CASSANDRA_HOSTS ?? "").split(","),
  localDataCenter: process.env.CASSANDRA_LOCAL_DATACENTER,
});

export async function createKeystore() {
  console.log(`Connecting to instances: ${process.env.CASSANDRA_HOSTS}}`);
  await keystoreClient.connect();

  console.log(`Creating keyspace ${keyspace}...`);
  await keystoreClient.execute(`
    CREATE KEYSPACE IF NOT EXISTS ${keyspace}
    WITH REPLICATION = {
      'class': 'SimpleStrategy',
      'replication_factor': 1
    }
  `);
  console.log(`Created keyspace ${keyspace}!`);

  await keystoreClient.shutdown();
}
createKeystore();
