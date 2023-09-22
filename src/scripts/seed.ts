import { client } from "@/model/CassandraClient";
import { ColumnDTO, ColumnRepository } from "@/model/Column";
import { TaskRepository } from "@/model/Task";
import { loadEnvConfig } from "@next/env";
import { v4 as uuid } from "uuid";

const result = loadEnvConfig("./");
console.log(
  "Loaded Env Files: ",
  result.loadedEnvFiles.map((file) => file.path),
);
console.log("Using keyspace: ", process.env.CASSANDRA_KEYSPACE);

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
const taskRepository = new TaskRepository();

async function execute() {
  console.log("Start seeding");
  await client.connect();

  const columnPromises = columns.map(async (column) => {
    const columnId = uuid();
    await columnRepository.create({
      id: columnId,
      name: column.name,
      position: column.position,
      color: column.color,
    });

    const taskPromises = column.taskNames.map(async (taskName, index) =>
      taskRepository.create({
        id: uuid(),
        text: taskName,
        columnId,
        position: index,
      }),
    );

    await Promise.all(taskPromises);
    console.log(`Created column ${column.name}`);
  });

  await Promise.all(columnPromises);
  await client.shutdown();
}
execute();
