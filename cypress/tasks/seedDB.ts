import { client } from "@/model/CassandraClient";
import { StateDTO, StateRepository } from "@/model/State";
import { TaskRepository } from "@/model/Task";
import { UserRepository } from "@/model/User";
import { loadEnvConfig } from "@next/env";
import { v4 as uuid } from "uuid";

const result = loadEnvConfig("./");

/****
 * SEED DATA
 */
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

const userRepository = new UserRepository();
const stateRepository = new StateRepository();
const taskRepository = new TaskRepository();

async function createState(state: StateSeed, owner: string) {
  const stateId = uuid();
  await stateRepository.create({
    id: stateId,
    name: state.name,
    position: state.position,
    color: state.color,
    owner,
  });

  const taskPromises = state.taskNames.map(async (taskName, index) =>
    taskRepository.create({
      id: uuid(),
      text: `${taskName} (${owner})`,
      stateId,
      position: index,
      owner,
    }),
  );

  await Promise.all(taskPromises);
}

export default async function seedDB() {
  const owners = await userRepository.list();
  if (owners.length < 0) {
    return;
  }

  const promises = owners
    .splice(0, 5) // Take 5 users. Not necessarily the first 5.
    .map((owner) => states.map((state) => createState(state, owner.email)))
    .flat(1);

  return Promise.all(promises);
}
