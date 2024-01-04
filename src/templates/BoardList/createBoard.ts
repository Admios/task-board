"use server";

import { BoardDTO, BoardRepository } from "@/model/Board";
import { StateDTO, StateRepository } from "@/model/State";
import { UserDTO } from "@/model/User";
import { v4 as uuid } from "uuid";

type StateSeed = {
  name: StateDTO["name"];
  position: StateDTO["position"];
  color: StateDTO["color"];
};

const DEFAULT_STATES: StateSeed[] = [
  {
    name: "New",
    position: 0,
    color: "black",
  },
  {
    name: "In Progress",
    position: 1,
    color: "orange",
  },
  {
    name: "In Review",
    position: 2,
    color: "green",
  },
  {
    name: "Done",
    position: 3,
    color: "blue",
  },
];

const boardRepository = new BoardRepository();
const stateRepository = new StateRepository();

export async function doCreateDefaultBoard(user: UserDTO) {
  if (!user) {
    return;
  }

  const boardId = uuid();
  await boardRepository.create({
    id: boardId,
    name: "My Board",
    owner: user.email,
  });

  const promises = DEFAULT_STATES.map(async (state) => {
    await stateRepository.create({
      id: uuid(),
      boardId,
      name: state.name,
      color: state.color,
      position: state.position,
    });
  });

  await Promise.all(promises);
}
