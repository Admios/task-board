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

const repositories: AbstractRepository<any>[] = [
  new AuthenticatorRepository(),
  new ColumnRepository(),
  new TaskRepository(),
  new UserRepository(),
];

async function execute() {
  console.log("Start seeding");
  const promises = repositories.map(async (repository) => {
    await repository.createTable();
    console.log(`Created table ${repository.tableName}`);
  });

  await Promise.all(promises);
  await client.shutdown();
}
execute();
