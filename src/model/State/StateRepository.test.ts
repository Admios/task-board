import { StateDTO } from "./StateDTO";
import { StateRepository } from "./StateRepository";
import { mapper } from "../CassandraClient";

jest.mock("../CassandraClient");

describe("StateRepository", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("listByBoardId should return a list of states for a given board", async () => {
    const stateRepository: StateRepository = new StateRepository();
    const mapperMock = mapper.forModel("");
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

    (mapperMock.mapWithQuery as jest.Mock).mockReturnValue(
      async (params: { id: string }) => {
        const response = states.filter((state) => state.boardId === params.id);

        return {
          toArray: () => response,
        };
      },
    );

    const result = await stateRepository.listByBoardId(boardId);

    expect(result).toEqual(states);
    expect(mapperMock.mapWithQuery as jest.Mock).toHaveBeenCalledWith(
      `SELECT * FROM states WHERE board_id = ?`,
      expect.any(Function),
    );
  });
});
