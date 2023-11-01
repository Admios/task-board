import { StateDTO, StateRepository } from "@/model/State";
import { TaskRepository } from "@/model/Task";
import { UserDTO } from "@/model/User";
import { v4 as uuid } from "uuid";
import stateSeed from "../fixtures/stateSeed.json";
import users from "../fixtures/users.json";

/****
 * SEED DATA
 */
type StateSeed = {
  name: StateDTO["name"];
  position: StateDTO["position"];
  color: StateDTO["color"];
  taskNames: string[];
};

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
  const states = stateSeed as StateSeed[];
  const promises = (users as UserDTO[])
    .map((owner) => states.map((state) => createState(state, owner.email)))
    .flat(1);

  return Promise.all(promises);
}
