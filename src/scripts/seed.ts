import { BoardRepository } from "@/model/Board";
import { client } from "@/model/CassandraClient";
import { StateDTO, StateRepository } from "@/model/State";
import { TaskRepository } from "@/model/Task";
import { UserRepository } from "@/model/User";
import env from "@next/env";
import { v4 as uuid } from "uuid";

const result = env.loadEnvConfig("./");
console.log(
  "Loaded Env Files: ",
  result.loadedEnvFiles.map((file) => file.path),
);
console.log("Using keyspace: ", process.env.CASSANDRA_KEYSPACE);

/****
 * SEED DATA
 */

const boards: string[] = ["Work", "Todo List", "Groceries"];

type StateSeed = {
  name: StateDTO["name"];
  position: StateDTO["position"];
  color: StateDTO["color"];
  taskNames: string[];
};

const states: StateSeed[] = [
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

const boardRepository = new BoardRepository();
const userRepository = new UserRepository();
const stateRepository = new StateRepository();
const taskRepository = new TaskRepository();

async function createBoard(board: string, owner: string) {
  const boardId = uuid();
  await boardRepository.create({
    id: boardId,
    name: board,
    owner,
  });

  const statesPromises = states.map((state) =>
    createState(state, boardId, owner),
  );

  await Promise.all(statesPromises);

  console.log(`Created board ${board} for user ${owner}`);
}

async function createState(state: StateSeed, boardId: string, owner: string) {
  const stateId = uuid();
  await stateRepository.create({
    id: stateId,
    name: state.name,
    position: state.position,
    color: state.color,
    boardId: boardId,
  });

  const taskPromises = state.taskNames.map(async (taskName, index) =>
    taskRepository.create({
      id: uuid(),
      text: `${taskName} (${owner})`,
      stateId,
      position: index,
    }),
  );

  await Promise.all(taskPromises);
  console.log(`Created state ${state.name} for user ${owner}`);
}

async function execute() {
  console.log("Start seeding");
  await client.connect();

  const owners = await userRepository.list();
  if (owners.length < 0) {
    console.log("No users found. Please create a user first");
    return;
  }

  const promises = owners
    .splice(0, 5) // Take 5 users. Not necessarily the first 5.
    .map((owner) => boards.map((board) => createBoard(board, owner.email)))
    .flat(1);

  await Promise.all(promises);
  await client.shutdown();
}
execute();
