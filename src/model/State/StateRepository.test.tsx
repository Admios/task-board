import { StateRepository } from "./StateRepository";
import { StateDTO } from "./StateDTO";

const mapper = {
  get: jest.fn(),
  findAll: jest.fn(),
  insert: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  mapWithQuery: jest.fn(),
};

jest.mock("../CassandraClient", () => ({
  mapper: {
    forModel: jest.fn(() => mapper),
  },
}));

describe("StateRepository", () => {
  let stateRepository: StateRepository;

  beforeEach(() => {
    stateRepository = new StateRepository();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const userId = "user123";
  const state: StateDTO = {
    id: "1",
    name: "name",
    color: "black",
    position: 1,
    owner: userId,
  };
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

  it("listByUserId should return a list of states for a given user", async () => {
    mapper.mapWithQuery.mockReturnValue(async (params: { id: string }) => {
      return states.filter((state) => state.owner === params.id);
    });

    const result = await stateRepository.listByUserId(userId);

    expect(result).toEqual(states);
    expect(mapper.mapWithQuery).toHaveBeenCalledWith(
      `SELECT * FROM states WHERE owner = ?`,
      expect.any(Function),
    );
  });

  it("findById should return a state by ID", async () => {
    mapper.get.mockResolvedValue(state);

    const result = await stateRepository.findById("1");

    expect(result).toEqual(state);
    expect(mapper.get).toHaveBeenCalledWith({ id: "1" });
  });

  it("findById should throw an error if state is not found", async () => {
    mapper.get.mockResolvedValue(null);

    await expect(stateRepository.findById("1")).rejects.toThrowError(
      "State not found",
    );
  });

  it("list should return a list of states", async () => {
    mapper.findAll.mockResolvedValue(states);

    const result = await stateRepository.list();

    expect(result).toEqual(states);
    expect(mapper.findAll).toHaveBeenCalled();
  });

  it("create should insert a state and return the first result", async () => {
    const insertResult = { first: () => state };
    mapper.insert.mockResolvedValue(insertResult);

    const result = await stateRepository.create(state);

    expect(result).toEqual(state);
    expect(mapper.insert).toHaveBeenCalledWith(state);
  });

  it("update should update a state and return the first result", async () => {
    const updatedState: StateDTO = {
      id: "10",
      name: "updatedName",
      color: "black",
      position: 4,
      owner: "updatedOwner",
    };
    const updatedResult = { first: () => updatedState };
    mapper.update.mockResolvedValue(updatedResult);

    const result = await stateRepository.update(updatedState);

    expect(result).toEqual(updatedState);
    expect(mapper.update).toHaveBeenCalledWith(updatedState);
  });

  it("delete should remove an state by ID", async () => {
    await stateRepository.delete("1");
    expect(mapper.remove).toHaveBeenCalledWith({ id: "1" });
  });
});
