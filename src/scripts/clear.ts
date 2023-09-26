import { AuthenticatorRepository } from "@/model/Authenticator";
import { client } from "@/model/CassandraClient";
import { ColumnRepository } from "@/model/Column";
import { TaskRepository } from "@/model/Task";
import { UserRepository } from "@/model/User";
import { loadEnvConfig } from "@next/env";

const result = loadEnvConfig("./");
console.log(
  "Loaded Env Files: ",
  result.loadedEnvFiles.map((file) => file.path),
);
console.log("Using keyspace: ", process.env.CASSANDRA_KEYSPACE);

const repositories = [
  new AuthenticatorRepository(),
  new ColumnRepository(),
  new TaskRepository(),
  new UserRepository(),
];

async function execute() {
  await client.connect();

  const promises = repositories.map(async (repository) => {
    await client.execute(`TRUNCATE TABLE ${repository.tableName}`);
    console.log(`Truncated table ${repository.tableName}`);
  });
  await Promise.all(promises);

  await client.shutdown();
}
execute();
