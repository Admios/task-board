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
  const result = await passkeyAuthentication.registrationOptions(username);
  cookies().set("userId", result.username, { httpOnly: true });
  return result;
}

export async function generateAuthenticationOptions(username: string) {
  const result = await passkeyAuthentication.authenticationOptions(username);
  cookies().set("userId", result.username, { httpOnly: true });
  return result;
}

export async function verifyRegistration(request: RegistrationResponseJSON) {
  const username = cookies().get("userId")?.value;
  if (!username) {
    throw new Error("Missing userId cookie");
  }
  return passkeyAuthentication.register(username, request);
}

export async function verifyAuthentication(
  request: AuthenticationResponseJSON,
) {
  const username = cookies().get("userId")?.value;
  if (!username) {
    throw new Error("Missing userId cookie");
  }

  return passkeyAuthentication.authenticate(username, request);
}
