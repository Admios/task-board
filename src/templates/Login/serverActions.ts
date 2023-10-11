"use server";

import { PasskeyAuthenticationFlow } from "@/authentication";
import { AuthenticatorRepository } from "@/model/Authenticator";
import { UserRepository } from "@/model/User";
import {
  AuthenticationResponseJSON,
  RegistrationResponseJSON,
} from "@simplewebauthn/typescript-types";
import { cookies } from "next/headers";

const userRepository = new UserRepository();
const passkeyAuthentication = new PasskeyAuthenticationFlow(
  userRepository,
  new AuthenticatorRepository(),
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
