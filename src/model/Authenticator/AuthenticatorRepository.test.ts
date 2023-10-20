import { CredentialDeviceType } from "@simplewebauthn/typescript-types";
import { VerifiedRegistrationResponse } from "@simplewebauthn/server";

import { AuthenticatorDTO } from "./AuthenticatorDTO";
import { AuthenticatorRepository } from "./AuthenticatorRepository";
import { mapper } from "../CassandraClient";

jest.mock("../CassandraClient");

describe("AuthenticatorRepository", () => {
  const userId = "user123";

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("listByUserId should return a list of authenticators for a given user", async () => {
    const authenticatorRepository: AuthenticatorRepository =
      new AuthenticatorRepository();
    const mapperMock = mapper.forModel("");
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

    (mapperMock.mapWithQuery as jest.Mock).mockReturnValue(
      async (params: { id: string }) => {
        const response = authenticators.filter(
          (auth) => auth.userId === params.id,
        );

        return {
          toArray: () => response,
        };
      },
    );

    const result = await authenticatorRepository.listByUserId(userId);

    expect(result).toEqual(authenticators);
    expect(mapperMock.mapWithQuery as jest.Mock).toHaveBeenCalledWith(
      `SELECT * FROM authenticators WHERE user_id = ?`,
      expect.any(Function),
    );
  });

  it("createFromRegistration should create an authenticator from registration info", async () => {
    const authenticatorRepository: AuthenticatorRepository =
      new AuthenticatorRepository();
    const mapperMock = mapper.forModel("");
    const registrationInfo = {
      counter: 1,
      credentialBackedUp: true,
      credentialDeviceType: "deviceType1" as CredentialDeviceType,
      credentialID: new Uint8Array(),
      credentialPublicKey: new Uint8Array(),
    };

    (mapperMock.insert as jest.Mock).mockResolvedValue({
      first: () => ({ ...registrationInfo, userId }),
    });

    const createdAuthenticator =
      await authenticatorRepository.createFromRegistration(
        userId,
        registrationInfo as VerifiedRegistrationResponse["registrationInfo"],
      );

    expect(createdAuthenticator).toEqual(
      expect.objectContaining(registrationInfo),
    );
    expect(createdAuthenticator?.userId).toEqual(userId);
  });

  it("createFromRegistration should throw an error when registrationInfo is undefined", async () => {
    const authenticatorRepository: AuthenticatorRepository =
      new AuthenticatorRepository();

    await expect(
      authenticatorRepository.createFromRegistration(userId, undefined),
    ).rejects.toThrowError("Registration has no verification info");
  });
});
