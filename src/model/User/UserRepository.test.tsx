import { UserRepository } from "./UserRepository";
import { UserDTO } from "./UserDTO";

const mapper = {
  get: jest.fn(),
  findAll: jest.fn(),
  insert: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

jest.mock("../CassandraClient", () => ({
  mapper: {
    forModel: jest.fn(() => mapper),
  },
}));

describe("UserRepository", () => {
  let userRepository: UserRepository;

  beforeEach(() => {
    userRepository = new UserRepository();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("findById should return a user by ID", async () => {
    const user: UserDTO = { email: "user@test.com" };
    mapper.get.mockResolvedValue(user);

    const result = await userRepository.findById("user@test.com");

    expect(result).toEqual(user);
    expect(mapper.get).toHaveBeenCalledWith({ id: "user@test.com" });
  });

  it("findById should throw an error if user is not found", async () => {
    mapper.get.mockResolvedValue(null);

    await expect(userRepository.findById("user@test.com")).rejects.toThrowError(
      "User not found",
    );
  });

  it("list should return a list of users", async () => {
    const users: UserDTO[] = [
      { email: "user1@test.com" },
      { email: "user2@test.com" },
    ];
    mapper.findAll.mockResolvedValue(users);

    const result = await userRepository.list();

    expect(result).toEqual(users);
    expect(mapper.findAll).toHaveBeenCalled();
  });

  it("create should insert a user and return the first result", async () => {
    const user: UserDTO = { email: "user@test.com" };
    const insertResult = { first: () => user };
    mapper.insert.mockResolvedValue(insertResult);

    const result = await userRepository.create(user);

    expect(result).toEqual(user);
    expect(mapper.insert).toHaveBeenCalledWith(user);
  });

  it("update should update a user and return the first result", async () => {
    const updatedUser: UserDTO = { email: "updatedUser@test.com" };
    const updatedResult = { first: () => updatedUser };
    mapper.update.mockResolvedValue(updatedResult);

    const result = await userRepository.update(updatedUser);

    expect(result).toEqual(updatedUser);
    expect(mapper.update).toHaveBeenCalledWith(updatedUser);
  });

  it("delete should remove a user by ID", async () => {
    await userRepository.delete("user@test.com");
    expect(mapper.remove).toHaveBeenCalledWith({ id: "user@test.com" });
  });
});
