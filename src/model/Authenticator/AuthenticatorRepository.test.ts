import { VerifiedRegistrationResponse } from "@simplewebauthn/server";
import { CredentialDeviceType } from "@simplewebauthn/typescript-types";
import { mapper } from "../CassandraClient";
import { AuthenticatorDTO } from "./AuthenticatorDTO";
import { AuthenticatorRepository } from "./AuthenticatorRepository";

jest.mock("../CassandraClient");

afterEach(() => {
  jest.clearAllMocks();
});

it("listByUserId should return a list of authenticators for a given user", async () => {
  const testUserId = "userId1";
  const testAuthenticators: AuthenticatorDTO[] = [
    {
      credentialID: new Uint8Array(),
      credentialPublicKey: new Uint8Array(),
      counter: 1,
      credentialDeviceType: "credential",
      credentialBackedUp: true,
      userId: testUserId,
    },
    {
      credentialID: new Uint8Array(),
      credentialPublicKey: new Uint8Array(),
      counter: 2,
      credentialDeviceType: "credential",
      credentialBackedUp: true,
      userId: testUserId,
    },
  ];

  const queryMock = jest.fn().mockResolvedValue({
    toArray: () => testAuthenticators,
  });
  (mapper.forModel as jest.Mock).mockReturnValueOnce({
    mapWithQuery: () => queryMock,
  });

  const authenticatorRepository = new AuthenticatorRepository();
  const result = await authenticatorRepository.listByUserId(testUserId);

  expect(result).toEqual(testAuthenticators);
  expect(queryMock).toHaveBeenCalledWith(
    expect.objectContaining({ userId: testUserId }),
  );
});

it("fromRegistration should create an authenticator from registration info", async () => {
  const userId = "userId1";
  const registrationInfo = {
    counter: 1,
    credentialBackedUp: true,
    credentialDeviceType: "deviceType1" as CredentialDeviceType,
    credentialID: new Uint8Array(),
    credentialPublicKey: new Uint8Array(),
  };

  const verification = {
    verified: true,
    registrationInfo,
  } as VerifiedRegistrationResponse;

  const newAuthenticator = AuthenticatorRepository.fromRegistration(
    userId,
    verification,
  );

  expect(newAuthenticator).toEqual(expect.objectContaining(registrationInfo));
  expect(newAuthenticator?.userId).toEqual(userId);
});

it("fromRegistration should throw an error when registrationInfo is undefined", async () => {
  const verification = { verified: true, registrationInfo: undefined };
  expect(() =>
    AuthenticatorRepository.fromRegistration("userId42", verification),
  ).toThrow("Registration has no verification info");
});
