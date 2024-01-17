import { StateDTO } from "./StateDTO";
import { StateRepository } from "./StateRepository";

jest.mock("../CassandraClient");

afterEach(() => {
  jest.clearAllMocks();
});

it("listByBoardId should return a list of states for a given board", async () => {
  const boardId = "board123";
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

  const stateRepository = new StateRepository();
  (stateRepository.queryByBoardId as jest.Mock).mockResolvedValueOnce({
    toArray: () => states,
  });
  const result = await stateRepository.listByBoardId(boardId);

  expect(result).toEqual(states);
  expect(stateRepository.queryByBoardId).toHaveBeenCalledWith({ id: boardId });
});
