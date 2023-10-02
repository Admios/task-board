"use server";

import { PasskeyAuthenticationFlow } from "@/authentication";
import { AuthenticatorRepository } from "@/model/Authenticator";
import { UserRepository } from "@/model/User";
import {
  AuthenticationResponseJSON,
  RegistrationResponseJSON,
} from "@simplewebauthn/typescript-types";
import { cookies } from "next/headers";

const passkeyAuthentication = new PasskeyAuthenticationFlow(
  new UserRepository(),
  new AuthenticatorRepository(),
);

export async function generateRegistrationOptions(username: string) {
  return passkeyAuthentication.registrationOptions(username);
}

export async function generateAuthenticationOptions(username: string) {
  return passkeyAuthentication.authenticationOptions(username);
}

export async function verifyRegistration(
  username: string,
  request: RegistrationResponseJSON,
) {
  const result = await passkeyAuthentication.register(username, request);
  cookies().set("userId", username, { httpOnly: true });
  return result;
}

export async function verifyAuthentication(
  username: string,
  request: AuthenticationResponseJSON,
) {
  const result = await passkeyAuthentication.authenticate(username, request);
  cookies().set("userId", username, { httpOnly: true });
  return result;
}
