import { BoardDTO } from "./BoardDTO";
import { BoardRepository } from "./BoardRepository";
import { mapper } from "../CassandraClient";

jest.mock("../CassandraClient");

describe("BoardRepository", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("listByUserId should return a list of boards for a given user", async () => {
    const boardRepository: BoardRepository = new BoardRepository();
    const mapperMock = mapper.forModel("");
    const userId = "user123";
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

    (mapperMock.mapWithQuery as jest.Mock).mockReturnValue(
      async (params: { id: string }) => {
        const response = boards.filter((board) => board.owner === params.id);

        return {
          toArray: () => response,
        };
      },
    );

    const result = await boardRepository.listByUserId(userId);

    expect(result).toEqual(boards);
    expect(mapperMock.mapWithQuery as jest.Mock).toHaveBeenCalledWith(
      `SELECT * FROM boards WHERE owner = ?`,
      expect.any(Function),
    );
  });
});
