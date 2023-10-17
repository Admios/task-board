import { AuthenticationChallengeRepository } from "./AuthenticationChallengeRepository";
import { AuthenticationChallengeDTO } from "./AuthenticationChallengeDTO";

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

describe("AuthenticationChallengeRepository", () => {
  let authenticatorChallengeRepository: AuthenticationChallengeRepository;

  beforeEach(() => {
    authenticatorChallengeRepository = new AuthenticationChallengeRepository();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const authenticationChallenge: AuthenticationChallengeDTO = {
    id: "1",
    challenge: "challenge",
  };
  const authenticationChallenges: AuthenticationChallengeDTO[] = [
    {
      id: "1",
      challenge: "challenge",
    },
    {
      id: "2",
      challenge: "challenge",
    },
  ];

  it("findById should return an authenticationChallenge by ID", async () => {
    mapper.get.mockResolvedValue(authenticationChallenge);

    const result = await authenticatorChallengeRepository.findById("1");

    expect(result).toEqual(authenticationChallenge);
    expect(mapper.get).toHaveBeenCalledWith({ id: "1" });
  });

  it("findById should throw an error if authenticationChallenge is not found", async () => {
    mapper.get.mockResolvedValue(null);

    await expect(
      authenticatorChallengeRepository.findById("1"),
    ).rejects.toThrowError("AuthenticationChallenge not found");
  });

  it("list should return a list of authenticationChallenges", async () => {
    mapper.findAll.mockResolvedValue(authenticationChallenges);

    const result = await authenticatorChallengeRepository.list();

    expect(result).toEqual(authenticationChallenges);
    expect(mapper.findAll).toHaveBeenCalled();
  });

  it("create should insert an authenticationChallenge and return the first result", async () => {
    const insertResult = { first: () => authenticationChallenge };
    mapper.insert.mockResolvedValue(insertResult);

    const result = await authenticatorChallengeRepository.create(
      authenticationChallenge,
    );

    expect(result).toEqual(authenticationChallenge);
    expect(mapper.insert).toHaveBeenCalledWith(authenticationChallenge);
  });

  it("update should update an authenticationChallenge and return the first result", async () => {
    const updatedAuthenticatorChallenge: AuthenticationChallengeDTO = {
      id: "2",
      challenge: "challenge",
    };
    const updatedResult = { first: () => updatedAuthenticatorChallenge };
    mapper.update.mockResolvedValue(updatedResult);

    const result = await authenticatorChallengeRepository.update(
      updatedAuthenticatorChallenge,
    );

    expect(result).toEqual(updatedAuthenticatorChallenge);
    expect(mapper.update).toHaveBeenCalledWith(updatedAuthenticatorChallenge);
  });

  it("delete should remove an authenticationChallenge by ID", async () => {
    await authenticatorChallengeRepository.delete("1");
    expect(mapper.remove).toHaveBeenCalledWith({ id: "1" });
  });
});
