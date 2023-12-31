import { AuthenticationChallengeRepository } from "@/model/AuthenticationChallenge";
import { AuthenticatorRepository } from "@/model/Authenticator";
import { BoardRepository } from "@/model/Board";
import { client } from "@/model/CassandraClient";
import { StateRepository } from "@/model/State";
import { TaskRepository } from "@/model/Task";
import { UserRepository } from "@/model/User";
import env from "@next/env";

const result = env.loadEnvConfig("./");
console.log(
  "Loaded Env Files: ",
  result.loadedEnvFiles.map((file) => file.path),
);
console.log("Using keyspace: ", process.env.CASSANDRA_KEYSPACE);

const repositories = [
  new AuthenticatorRepository(),
  new AuthenticationChallengeRepository(),
  new StateRepository(),
  new TaskRepository(),
  new UserRepository(),
  new BoardRepository(),
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
