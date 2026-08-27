"use server";

import { BoardRepository } from "@/model/Board";
import { transaction } from "@/model/SqliteClient";
import { StateDTO, StateRepository } from "@/model/State";
import { UserRepository } from "@/model/User";
import { cookies } from "next/headers";
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

const userRepository = new UserRepository();
const boardRepository = new BoardRepository();
const stateRepository = new StateRepository();

export async function doCreateDefaultBoard() {
  const currentCookies = await cookies();
  const userId = currentCookies.get("userId")?.value;
  if (!userId) {
    throw new Error("User is not logged in");
  }

  const user = userRepository.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const boardId = uuid();

  // Every id here is freshly generated, so these are real inserts, not
  // upserts — `create` throws if any of these somehow already existed.
  transaction(() => {
    boardRepository.create({ id: boardId, name: "My Board", owner: user.email });
    for (const state of DEFAULT_STATES) {
      stateRepository.create({
        id: uuid(),
        boardId,
        name: state.name,
        color: state.color,
        position: state.position,
      });
    }
  });
}
