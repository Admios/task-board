"use server";

import { Authenticator } from "@/authentication";
import { AuthenticatorRepository } from "@/model/Authenticator";
import { UserRepository } from "@/model/User";
import {
  AuthenticationResponseJSON,
  RegistrationResponseJSON,
} from "@simplewebauthn/typescript-types";
import { v4 as uuid } from "uuid";

const userRepository = new UserRepository();
const authenticatorRepository = new AuthenticatorRepository();
const authenticator = new Authenticator(
  userRepository,
  authenticatorRepository,
);

export async function generateRegistrationOptions(data: FormData) {
  const username = data.get("username") as string;
  if (!username) {
    throw new Error("Username is required");
  }

  const user = await userRepository.create({ id: uuid(), username });
  const options = await authenticator.registrationOptions(user.id);
  return { options, user };
}

export async function generateLoginOptions(data: FormData) {
  const username = data.get("username") as string;
  if (!username) {
    throw new Error("Username is required");
  }

  const user = await userRepository.findByUsername(username);
  const options = await authenticator.authenticationOptions(user.id);
  return { options, user };
}

export async function verifyRegistration(
  userId: string,
  request: RegistrationResponseJSON,
) {
  return authenticator.register(userId, request);
}

export async function verifyLogin(
  userId: string,
  request: AuthenticationResponseJSON,
) {
  return authenticator.authenticate(userId, request);
}
