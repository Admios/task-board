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

export async function generateRegistrationOptions(data: FormData) {
  const username = data.get("username") as string;
  if (!username) {
    throw new Error("Username is required");
  }

  const result = await passkeyAuthentication.registrationOptions(username);
  const options = { httpOnly: true };
  cookies().set("userId", result.user.id, options);
  cookies().set("username", result.user.username, options);
  return result;
}

export async function generateAuthenticationOptions(data: FormData) {
  const username = data.get("username") as string;
  if (!username) {
    throw new Error("Username is required");
  }

  const result = await passkeyAuthentication.authenticationOptions(username);
  const options = { httpOnly: true };
  cookies().set("userId", result.user.id, options);
  cookies().set("username", result.user.username, options);
  return result;
}

export async function verifyRegistration(request: RegistrationResponseJSON) {
  const userId = cookies().get("userId")?.value;
  if (!userId) {
    throw new Error("Missing userId cookie");
  }
  return passkeyAuthentication.register(userId, request);
}

export async function verifyAuthentication(
  request: AuthenticationResponseJSON,
) {
  const userId = cookies().get("userId")?.value;
  if (!userId) {
    throw new Error("Missing userId cookie");
  }

  return passkeyAuthentication.authenticate(userId, request);
}
