/**
 * @jest-environment node
 */

import { BoardRepository } from "@/model/Board";
import { applySchema, clearAllTables } from "@/model/schema";
import { StateRepository } from "@/model/State";
import { db } from "@/model/SqliteClient";
import { UserRepository } from "@/model/User";
import { TaskDTO } from "./TaskDTO";
import { TaskRepository } from "./TaskRepository";

beforeAll(() => {
  applySchema(db);
});

beforeEach(() => {
  clearAllTables(db);
});

function createUserBoardAndState(email: string, boardId: string, stateId: string) {
  new UserRepository().create({ email });
  new BoardRepository().create({ id: boardId, name: "A Board", owner: email });
  new StateRepository().create({
    id: stateId,
    boardId,
    name: "A State",
    color: "black",
    position: 0,
  });
}

it("listByStateIdList should return a list of tasks for a given list of states", () => {
  const stateIds = ["stateId1", "stateId2"];
  createUserBoardAndState("owner@example.com", "board1", stateIds[0]);
  createUserBoardAndState("owner2@example.com", "board2", stateIds[1]);

  const taskRepository = new TaskRepository();
  const tasks: TaskDTO[] = [
    {
      id: "task1",
      text: "Task 1",
      stateId: stateIds[0],
      position: 1,
    },
    {
      id: "task2",
      text: "Task 2",
      stateId: stateIds[1],
      position: 2,
    },
  ];
  for (const task of tasks) {
    taskRepository.create(task);
  }

  const result = taskRepository.listByStateIdList(stateIds);

  expect(result).toEqual(expect.arrayContaining(tasks));
  expect(result).toHaveLength(tasks.length);
});

it("listByStateIdList returns [] without throwing when given an empty array", () => {
  const taskRepository = new TaskRepository();

  const result = taskRepository.listByStateIdList([]);

  expect(result).toEqual([]);
});

it("rejects creating a task that references a non-existent state", () => {
  const taskRepository = new TaskRepository();

  expect(() =>
    taskRepository.create({
      id: "t",
      text: "x",
      stateId: "nope",
      position: 0,
    }),
  ).toThrow();
});

it("rejects creating a second task with the same id", () => {
  const stateId = "state1";
  createUserBoardAndState("owner3@example.com", "board3", stateId);

  const taskRepository = new TaskRepository();
  taskRepository.create({ id: "task1", text: "First", stateId, position: 0 });

  expect(() =>
    taskRepository.create({ id: "task1", text: "Second", stateId, position: 1 }),
  ).toThrow();
});
