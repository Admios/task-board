/**
 * @jest-environment node
 */

import { BoardRepository } from "@/model/Board";
import { applySchema, clearAllTables } from "@/model/schema";
import { db } from "@/model/SqliteClient";
import { UserRepository } from "@/model/User";
import { StateDTO } from "./StateDTO";
import { StateRepository } from "./StateRepository";

beforeAll(() => {
  applySchema(db);
});

beforeEach(() => {
  clearAllTables(db);
});

function createUserAndBoard(email: string, boardId: string) {
  new UserRepository().create({ email });
  new BoardRepository().create({ id: boardId, name: "A Board", owner: email });
}

it("listByBoardId should return a list of states for a given board", () => {
  const boardId = "board123";
  createUserAndBoard("owner@example.com", boardId);

  const stateRepository = new StateRepository();
  const states: StateDTO[] = [
    {
      id: "state1",
      boardId: boardId,
      name: "State 1",
      color: "black",
      position: 1,
    },
    {
      id: "state2",
      boardId: boardId,
      name: "State 2",
      color: "black",
      position: 2,
    },
  ];
  for (const state of states) {
    stateRepository.create(state);
  }

  const result = stateRepository.listByBoardId(boardId);

  expect(result).toEqual(expect.arrayContaining(states));
  expect(result).toHaveLength(states.length);
});

it("rejects creating a state that references a non-existent board", () => {
  const stateRepository = new StateRepository();

  expect(() =>
    stateRepository.create({
      id: "orphan-state",
      boardId: "does-not-exist",
      name: "Orphan",
      color: "black",
      position: 0,
    }),
  ).toThrow();
});

it("rejects creating a second state with the same id", () => {
  const boardId = "board456";
  createUserAndBoard("owner2@example.com", boardId);

  const stateRepository = new StateRepository();
  stateRepository.create({
    id: "state1",
    boardId,
    name: "First",
    color: "black",
    position: 0,
  });

  expect(() =>
    stateRepository.create({
      id: "state1",
      boardId,
      name: "Second",
      color: "orange",
      position: 1,
    }),
  ).toThrow();
});
