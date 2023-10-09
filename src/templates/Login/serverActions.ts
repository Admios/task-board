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

export async function generateRegistrationOptions(email: string) {
  return passkeyAuthentication.registrationOptions(email);
}

export async function generateAuthenticationOptions(email: string) {
  return passkeyAuthentication.authenticationOptions(email);
}

export async function verifyRegistration(
  email: string,
  request: RegistrationResponseJSON,
) {
  const result = await passkeyAuthentication.register(email, request);
  cookies().set("userId", email, { httpOnly: true });
  return result;
}

export async function verifyAuthentication(
  email: string,
  request: AuthenticationResponseJSON,
) {
  const result = await passkeyAuthentication.authenticate(email, request);
  cookies().set("userId", email, { httpOnly: true });
  return result;
}
