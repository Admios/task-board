import { StateDTO } from "./StateDTO";
import { StateRepository } from "./StateRepository";
import { mapper } from "../CassandraClient";

jest.mock("../CassandraClient");

describe("StateRepository", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("listByUserId should return a list of states for a given user", async () => {
    const stateRepository: StateRepository = new StateRepository();
    const mapperMock = mapper.forModel("");
    const userId = "user123";
    const states: StateDTO[] = [
      {
        id: "state1",
        name: "State 1",
        color: "black",
        position: 1,
        owner: userId,
      },
      {
        id: "state2",
        name: "State 2",
        color: "black",
        position: 2,
        owner: userId,
      },
    ];

    (mapperMock.mapWithQuery as jest.Mock).mockReturnValue(
      async (params: { id: string }) => {
        const response = states.filter((state) => state.owner === params.id);

        return {
          toArray: () => response,
        };
      },
    );

    const result = await stateRepository.listByUserId(userId);

    expect(result).toEqual(states);
    expect(mapperMock.mapWithQuery as jest.Mock).toHaveBeenCalledWith(
      `SELECT * FROM states WHERE owner = ?`,
      expect.any(Function),
    );
  });
});
