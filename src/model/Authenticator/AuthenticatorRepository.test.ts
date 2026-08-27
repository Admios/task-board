import {
  CredentialDeviceType,
  VerifiedRegistrationResponse,
} from "@simplewebauthn/server";
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
      credentialID: "credentialId1",
      credentialPublicKey: new Uint8Array(),
      counter: 1,
      credentialDeviceType: "credential",
      credentialBackedUp: true,
      userId: testUserId,
    },
    {
      credentialID: "credentialId2",
      credentialPublicKey: new Uint8Array(),
      counter: 2,
      credentialDeviceType: "credential",
      credentialBackedUp: true,
      userId: testUserId,
    },
  ];
  const authenticatorRepository = new AuthenticatorRepository();
  const mockedFunction = authenticatorRepository.queryByUserId as jest.Mock;
  mockedFunction.mockResolvedValueOnce({ toArray: () => testAuthenticators });

  const result = await authenticatorRepository.listByUserId(testUserId);

  expect(result).toEqual(testAuthenticators);
  expect(mockedFunction).toHaveBeenCalledWith({ userId: testUserId });
});

it("fromRegistration should create an authenticator from registration info", async () => {
  const userId = "userId1";
  const registrationInfo = {
    credentialBackedUp: true,
    credentialDeviceType: "deviceType1" as CredentialDeviceType,
    credential: {
      id: "credentialId1",
      publicKey: new Uint8Array(),
      counter: 1,
    },
  };

  const verification = {
    verified: true,
    registrationInfo,
  } as VerifiedRegistrationResponse;

  const newAuthenticator = AuthenticatorRepository.fromRegistration(
    userId,
    verification,
  );

  expect(newAuthenticator).toEqual({
    credentialID: registrationInfo.credential.id,
    credentialPublicKey: registrationInfo.credential.publicKey,
    counter: registrationInfo.credential.counter,
    credentialDeviceType: registrationInfo.credentialDeviceType,
    credentialBackedUp: registrationInfo.credentialBackedUp,
    userId,
  });
});

it("fromRegistration should throw an error when registrationInfo is undefined", async () => {
  const verification = {
    verified: true,
    registrationInfo: undefined,
  } as unknown as VerifiedRegistrationResponse;
  expect(() =>
    AuthenticatorRepository.fromRegistration("userId42", verification),
  ).toThrow("Registration has no verification info");
});
