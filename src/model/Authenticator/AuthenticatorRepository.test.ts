/**
 * @jest-environment node
 */

import { applySchema, clearAllTables } from "@/model/schema";
import { db } from "@/model/SqliteClient";
import { UserRepository } from "@/model/User";
import {
  CredentialDeviceType,
  VerifiedRegistrationResponse,
} from "@simplewebauthn/server";
import { AuthenticatorDTO } from "./AuthenticatorDTO";
import { AuthenticatorRepository } from "./AuthenticatorRepository";

beforeAll(() => {
  applySchema(db);
});

beforeEach(() => {
  clearAllTables(db);
});

it("listByUserId should return a list of authenticators for a given user", () => {
  const testUserId = "userId1@example.com";
  new UserRepository().create({ email: testUserId });

  const authenticatorRepository = new AuthenticatorRepository();
  const testAuthenticators: AuthenticatorDTO[] = [
    {
      credentialID: "credentialId1",
      credentialPublicKey: new Uint8Array([1, 2, 3]),
      counter: 1,
      credentialDeviceType: "credential",
      credentialBackedUp: true,
      // `transports` is optional on the DTO but always comes back as `[]`
      // (never `undefined`) once round-tripped through `fromRow`.
      transports: [],
      userId: testUserId,
    },
    {
      credentialID: "credentialId2",
      credentialPublicKey: new Uint8Array([4, 5, 6]),
      counter: 2,
      credentialDeviceType: "credential",
      credentialBackedUp: true,
      transports: [],
      userId: testUserId,
    },
  ];
  for (const authenticator of testAuthenticators) {
    authenticatorRepository.create(authenticator);
  }

  const result = authenticatorRepository.listByUserId(testUserId);

  expect(result).toEqual(expect.arrayContaining(testAuthenticators));
  expect(result).toHaveLength(testAuthenticators.length);
});

it("round-trips credentialPublicKey bytes, transports, and credentialBackedUp", () => {
  const testUserId = "userId2@example.com";
  new UserRepository().create({ email: testUserId });

  const authenticatorRepository = new AuthenticatorRepository();
  const publicKey = new Uint8Array([9, 8, 7, 6, 5]);
  const authenticator: AuthenticatorDTO = {
    credentialID: "credentialId3",
    credentialPublicKey: publicKey,
    counter: 3,
    credentialDeviceType: "multiDevice",
    credentialBackedUp: true,
    transports: ["usb", "internal"],
    userId: testUserId,
  };

  authenticatorRepository.create(authenticator);
  const result = authenticatorRepository.findById("credentialId3");

  expect(Array.from(result.credentialPublicKey)).toEqual(Array.from(publicKey));
  expect(result.transports).toEqual(["usb", "internal"]);
  expect(result.credentialBackedUp).toBe(true);
});

it("rejects creating an authenticator that references a non-existent user", () => {
  const authenticatorRepository = new AuthenticatorRepository();

  expect(() =>
    authenticatorRepository.create({
      credentialID: "orphan-credential",
      credentialPublicKey: new Uint8Array([1]),
      counter: 0,
      credentialDeviceType: "singleDevice",
      credentialBackedUp: false,
      userId: "does-not-exist@example.com",
    }),
  ).toThrow();
});

it("update should persist a new counter for an existing authenticator", () => {
  const testUserId = "userId4@example.com";
  new UserRepository().create({ email: testUserId });

  const authenticatorRepository = new AuthenticatorRepository();
  const authenticator: AuthenticatorDTO = {
    credentialID: "credentialId4",
    credentialPublicKey: new Uint8Array([1, 2]),
    counter: 1,
    credentialDeviceType: "singleDevice",
    credentialBackedUp: false,
    userId: testUserId,
  };
  authenticatorRepository.create(authenticator);

  authenticatorRepository.update({ ...authenticator, counter: 42 });

  expect(authenticatorRepository.findById("credentialId4").counter).toBe(42);
});

it("update should throw rather than create when the credential doesn't exist", () => {
  const authenticatorRepository = new AuthenticatorRepository();

  expect(() =>
    authenticatorRepository.update({
      credentialID: "never-created",
      credentialPublicKey: new Uint8Array([1]),
      counter: 0,
      credentialDeviceType: "singleDevice",
      credentialBackedUp: false,
      userId: "someone@example.com",
    }),
  ).toThrow("Authenticator not found");
});

it("fromRegistration should create an authenticator from registration info", () => {
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

it("fromRegistration should throw an error when registrationInfo is undefined", () => {
  const verification = {
    verified: true,
    registrationInfo: undefined,
  } as unknown as VerifiedRegistrationResponse;
  expect(() =>
    AuthenticatorRepository.fromRegistration("userId42", verification),
  ).toThrow("Registration has no verification info");
});
