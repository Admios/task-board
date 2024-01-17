import { BoardDTO } from "./BoardDTO";
import { BoardRepository } from "./BoardRepository";

jest.mock("../CassandraClient");

afterEach(() => {
  jest.clearAllMocks();
});

it("listByUserId should return a list of boards for a given user", async () => {
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

  const boardRepository = new BoardRepository();
  (boardRepository.queryByOwner as jest.Mock).mockResolvedValueOnce({
    toArray: () => boards,
  });

  const result = await boardRepository.listByUserId(userId);

  expect(result).toEqual(boards);
  expect(boardRepository.queryByOwner).toHaveBeenCalledWith({ id: userId });
});
