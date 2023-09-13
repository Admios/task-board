import { AuthenticatorRepository } from "@/model/Authenticator";
import { client } from "@/model/CassandraClient";
import { ColumnDTO, ColumnRepository } from "@/model/Column";
import { TaskRepository } from "@/model/Task";
import { UserRepository } from "@/model/User";
import { config as dotenv } from "dotenv";

dotenv({
  path: ".env.local",
});

/****
 * SEED DATA
 */
type ColumnSeed = Omit<ColumnDTO, "id"> & { taskNames: string[] };
const columns: ColumnSeed[] = [
  {
    name: "New",
    position: 0,
    color: "black",
    taskNames: ["Task 17", "Task 28", "Task 39"],
  },
  {
    name: "In Progress",
    position: 1,
    color: "orange",
    taskNames: ["Task 45", "Task 56"],
  },
  {
    name: "In Review",
    position: 2,
    color: "green",
    taskNames: ["Task 87", "Task 29", "Task 63", "Task 4"],
  },
  {
    name: "Done",
    position: 3,
    color: "blue",
    taskNames: ["Task 7", "Task 8", "Task 9"],
  },
];

const columnRepository = new ColumnRepository();
const userRepository = new UserRepository();
const taskRepository = new TaskRepository();
const authenticatorRepository = new AuthenticatorRepository();

async function execute() {
  console.log("Start seeding");
  await client.connect();

  const repositoryPromises = [
    authenticatorRepository,
    columnRepository,
    taskRepository,
    userRepository,
  ].map(async (repository) => {
    await repository.createTable();
    console.log(`Created table ${repository.tableName}`);
  });
  await Promise.all(repositoryPromises);

  const columnPromises = columns.map(async (column) => {
    const { id } = await columnRepository.create({
      name: column.name,
      position: column.position,
      color: column.color,
    });

    // const taskPromises = column.taskNames.map(async (taskName, index) =>
    //   taskRepository.create({
    //     text: taskName,
    //     columnId: id,
    //     position: index,
    //   }),
    // );

    // await Promise.all(taskPromises);
    console.log(`Created column ${column.name}`);
  });

  await Promise.all(columnPromises);
  await client.shutdown();
}
execute();
