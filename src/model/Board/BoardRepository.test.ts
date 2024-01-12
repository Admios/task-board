import { BoardDTO } from "./BoardDTO";
import { BoardRepository } from "./BoardRepository";
import { mapper } from "../CassandraClient";

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

  const queryMock = jest.fn().mockResolvedValue({
    toArray: () => boards,
  });
  (mapper.forModel as jest.Mock).mockReturnValue({
    mapWithQuery: jest.fn().mockReturnValue(queryMock),
  });

  const boardRepository = new BoardRepository();
  const result = await boardRepository.listByUserId(userId);

  expect(result).toEqual(boards);
  expect(queryMock).toHaveBeenCalledWith({ id: userId });
});
