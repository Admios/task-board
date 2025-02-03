"use server";

import { BoardRepository } from "@/model/Board";
import { mapper } from "@/model/CassandraClient";
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

  const user = await userRepository.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const boardId = uuid();

  const batchedOperations = [
    boardRepository.mapper.batching.insert({
      id: boardId,
      name: "My Board",
      owner: user.email,
    }),
  ];
  for (const state of DEFAULT_STATES) {
    const operation = stateRepository.mapper.batching.insert({
      id: uuid(),
      boardId,
      name: state.name,
      color: state.color,
      position: state.position,
    });
    batchedOperations.push(operation);
  }

  await mapper.batch(batchedOperations);
}
