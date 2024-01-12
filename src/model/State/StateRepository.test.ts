import { mapper } from "../CassandraClient";
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

  const queryMock = jest.fn().mockResolvedValue({
    toArray: () => states,
  });
  (mapper.forModel as jest.Mock).mockReturnValue({
    mapWithQuery: jest.fn().mockReturnValue(queryMock),
  });

  const stateRepository = new StateRepository();
  const result = await stateRepository.listByBoardId(boardId);

  expect(result).toEqual(states);
  expect(queryMock).toHaveBeenCalledWith({ id: boardId });
});
