import type { StateDTO } from "@/model/State";
import env from "@next/env";
import { v4 as uuid } from "uuid";

const result = env.loadEnvConfig("./");
console.log(
  "Loaded Env Files: ",
  result.loadedEnvFiles.map((file) => file.path),
);
console.log("Using database: ", process.env.SQLITE_PATH ?? "./data/tasks.db");

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

async function run() {
  const { db, transaction } = await import("@/model/SqliteClient");
  const { BoardRepository } = await import("@/model/Board");
  const { StateRepository } = await import("@/model/State");
  const { TaskRepository } = await import("@/model/Task");
  const { UserRepository } = await import("@/model/User");

  const boardRepository = new BoardRepository();
  const userRepository = new UserRepository();
  const stateRepository = new StateRepository();
  const taskRepository = new TaskRepository();

  // Every id below is freshly generated, so seeding always inserts new
  // rows — `create` is correct here, not `upsert`.
  function createBoard(board: string, owner: string) {
    const boardId = uuid();
    boardRepository.create({
      id: boardId,
      name: board,
      owner,
    });

    for (const state of states) {
      createState(state, boardId, owner);
    }

    console.log(`Created board ${board} for user ${owner}`);
  }

  function createState(state: StateSeed, boardId: string, owner: string) {
    const stateId = uuid();
    stateRepository.create({
      id: stateId,
      name: state.name,
      position: state.position,
      color: state.color,
      boardId: boardId,
    });

    state.taskNames.forEach((taskName, index) => {
      taskRepository.create({
        id: uuid(),
        text: `${taskName} (${owner})`,
        stateId,
        position: index,
      });
    });

    console.log(`Created state ${state.name} for user ${owner}`);
  }

  console.log("Start seeding");

  const owners = userRepository.list();
  if (owners.length === 0) {
    console.log("No users found. Please create a user first");
    db.close();
    return;
  }

  transaction(() => {
    owners
      .splice(0, 5) // Take 5 users. Not necessarily the first 5.
      .forEach((owner) => {
        for (const board of boards) {
          createBoard(board, owner.email);
        }
      });
  });

  db.close();
}

run();
