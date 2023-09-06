"use server";

import { PasskeyAuthenticationFlow } from "@/authentication";
import { AuthenticatorRepository } from "@/model/Authenticator";
import { UserRepository } from "@/model/User";
import {
  AuthenticationResponseJSON,
  RegistrationResponseJSON,
} from "@simplewebauthn/typescript-types";

const passkeyAuthentication = new PasskeyAuthenticationFlow(
  new UserRepository(),
  new AuthenticatorRepository(),
);

export async function generateRegistrationOptions(data: FormData) {
  const username = data.get("username") as string;
  if (!username) {
    throw new Error("Username is required");
  }

  return passkeyAuthentication.registrationOptions(username);
}

export async function generateAuthenticationOptions(data: FormData) {
  const username = data.get("username") as string;
  if (!username) {
    throw new Error("Username is required");
  }

  return passkeyAuthentication.authenticationOptions(username);
}

export async function verifyRegistration(
  userId: string,
  request: RegistrationResponseJSON,
) {
  return passkeyAuthentication.register(userId, request);
}

export async function verifyAuthentication(
  userId: string,
  request: AuthenticationResponseJSON,
) {
  return passkeyAuthentication.authenticate(userId, request);
}
