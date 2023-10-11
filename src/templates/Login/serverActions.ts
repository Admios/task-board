"use server";

import { PasskeyAuthenticationFlow } from "@/authentication";
import { AuthenticationChallengeRepository } from "@/model/AuthenticationChallenge";
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
  new AuthenticationChallengeRepository(),
);

export async function generateOptions(email: string) {
  return passkeyAuthentication.generateOptions(email);
}

export async function verifyOptions(
  email: string,
  request: RegistrationResponseJSON | AuthenticationResponseJSON,
) {
  const result = await passkeyAuthentication.verifyOptions(email, request);
  cookies().set("userId", email, { httpOnly: true });
  return result;
}
