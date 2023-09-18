import { AbstractRepository } from "@/model/AbstractRepository";
import { AuthenticatorRepository } from "@/model/Authenticator";
import { client } from "@/model/CassandraClient";
import { ColumnRepository } from "@/model/Column";
import { TaskRepository } from "@/model/Task";
import { UserRepository } from "@/model/User";
import { config as dotenv } from "dotenv";

dotenv({
  path: ".env.local",
});

const repositories = [
  new AuthenticatorRepository(),
  new ColumnRepository(),
  new TaskRepository(),
  new UserRepository(),
];

async function execute() {
  const keyspace = process.env.CASSANDRA_KEYSPACE ?? "tasks";
  console.log("Using keyspace: ", keyspace);
  const promises = repositories.map(async (repository) => {
    await client.execute(`DROP TABLE IF EXISTS ${repository.tableName}`);
    console.log(`Dropped table ${repository.tableName}`);
  });

  await Promise.all(promises);
  await client.shutdown();
}
execute();
