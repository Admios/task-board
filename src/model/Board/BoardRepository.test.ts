/**
 * @jest-environment node
 */

import { applySchema, clearAllTables } from "@/model/schema";
import { db } from "@/model/SqliteClient";
import { UserRepository } from "@/model/User";
import { BoardDTO } from "./BoardDTO";
import { BoardRepository } from "./BoardRepository";

beforeAll(() => {
  applySchema(db);
});

beforeEach(() => {
  clearAllTables(db);
});

it("listByUserId should return a list of boards for a given user", () => {
  const userId = "user123@example.com";
  const userRepository = new UserRepository();
  userRepository.create({ email: userId });

  const boardRepository = new BoardRepository();
  const boards: BoardDTO[] = [
    {
      id: "boards1",
      name: "Boards 1",
      owner: userId,
    },
    {
      id: "boards2",
      name: "Boards 2",
      owner: userId,
    },
  ];
  for (const board of boards) {
    boardRepository.create(board);
  }

  const result = boardRepository.listByUserId(userId);

  expect(result).toEqual(expect.arrayContaining(boards));
  expect(result).toHaveLength(boards.length);
});

it("listByUserId should return an empty list when the owner has no boards", () => {
  const userId = "lonely@example.com";
  const userRepository = new UserRepository();
  userRepository.create({ email: userId });

  const boardRepository = new BoardRepository();

  const result = boardRepository.listByUserId(userId);

  expect(result).toEqual([]);
});

it("rejects creating a board that references a non-existent owner", () => {
  const boardRepository = new BoardRepository();

  expect(() =>
    boardRepository.create({
      id: "orphan-board",
      name: "Orphan",
      owner: "does-not-exist@example.com",
    }),
  ).toThrow();
});

it("rejects creating a second board with the same id", () => {
  const userId = "dup@example.com";
  new UserRepository().create({ email: userId });

  const boardRepository = new BoardRepository();
  boardRepository.create({ id: "board1", name: "First", owner: userId });

  expect(() =>
    boardRepository.create({ id: "board1", name: "Second", owner: userId }),
  ).toThrow();
});
