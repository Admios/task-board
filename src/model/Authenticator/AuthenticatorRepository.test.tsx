import { AuthenticatorRepository } from "./AuthenticatorRepository";
import { AuthenticatorDTO } from "./AuthenticatorDTO";

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

describe("AuthenticatorRepository", () => {
  let authenticatorRepository: AuthenticatorRepository;

  beforeEach(() => {
    authenticatorRepository = new AuthenticatorRepository();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const userId = "user123";
  const authenticator: AuthenticatorDTO = {
    credentialID: new Uint8Array(),
    credentialPublicKey: new Uint8Array(),
    counter: 1,
    credentialDeviceType: "credential",
    credentialBackedUp: true,
    userId: userId,
  };
  const authenticators: AuthenticatorDTO[] = [
    {
      credentialID: new Uint8Array(),
      credentialPublicKey: new Uint8Array(),
      counter: 1,
      credentialDeviceType: "credential",
      credentialBackedUp: true,
      userId: userId,
    },
    {
      credentialID: new Uint8Array(),
      credentialPublicKey: new Uint8Array(),
      counter: 2,
      credentialDeviceType: "credential",
      credentialBackedUp: true,
      userId: userId,
    },
  ];

  it("listByUserId should return a list of authenticators for a given user", async () => {
    mapper.mapWithQuery.mockReturnValue(async (params: { id: string }) => {
      return authenticators.filter((auth) => auth.userId === params.id);
    });

    const result = await authenticatorRepository.listByUserId(userId);

    expect(result).toEqual(authenticators);
    expect(mapper.mapWithQuery).toHaveBeenCalledWith(
      `SELECT * FROM authenticators WHERE user_id = ?`,
      expect.any(Function),
    );
  });

  it("createFromRegistration should throw an error when registrationInfo is undefined", async () => {
    const userId = "user123";

    await expect(
      authenticatorRepository.createFromRegistration(userId, undefined),
    ).rejects.toThrowError("Registration has no verification info");
  });

  it("findById should return an authenticator by ID", async () => {
    mapper.get.mockResolvedValue(authenticator);

    const result = await authenticatorRepository.findById("1");

    expect(result).toEqual(authenticator);
    expect(mapper.get).toHaveBeenCalledWith({ id: "1" });
  });

  it("findById should throw an error if authenticator is not found", async () => {
    mapper.get.mockResolvedValue(null);

    await expect(authenticatorRepository.findById("1")).rejects.toThrowError(
      "Authenticator not found",
    );
  });

  it("list should return a list of authenticators", async () => {
    mapper.findAll.mockResolvedValue(authenticators);

    const result = await authenticatorRepository.list();

    expect(result).toEqual(authenticators);
    expect(mapper.findAll).toHaveBeenCalled();
  });

  it("create should insert an authenticator and return the first result", async () => {
    const insertResult = { first: () => authenticator };
    mapper.insert.mockResolvedValue(insertResult);

    const result = await authenticatorRepository.create(authenticator);

    expect(result).toEqual(authenticator);
    expect(mapper.insert).toHaveBeenCalledWith(authenticator);
  });

  it("update should update an authenticator and return the first result", async () => {
    const updatedAuthenticator: AuthenticatorDTO = {
      credentialID: new Uint8Array(),
      credentialPublicKey: new Uint8Array(),
      counter: 2,
      credentialDeviceType: "credential",
      credentialBackedUp: true,
      userId: userId,
    };
    const updatedResult = { first: () => updatedAuthenticator };
    mapper.update.mockResolvedValue(updatedResult);

    const result = await authenticatorRepository.update(updatedAuthenticator);

    expect(result).toEqual(updatedAuthenticator);
    expect(mapper.update).toHaveBeenCalledWith(updatedAuthenticator);
  });

  it("delete should remove an authenticator by ID", async () => {
    await authenticatorRepository.delete("1");
    expect(mapper.remove).toHaveBeenCalledWith({ id: "1" });
  });
});
