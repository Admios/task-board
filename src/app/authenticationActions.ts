"use server";

import { Authenticator } from "@/authentication";
import { AuthenticatorRepository } from "@/model/Authenticator";
import { UserRepository } from "@/model/User";
import { User } from "@/model/types";
import { VerifiedRegistrationResponse } from "@simplewebauthn/server";
import {
  AuthenticationResponseJSON,
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
  RegistrationResponseJSON,
} from "@simplewebauthn/typescript-types";
import { VerifiedAuthenticationResponse } from "node_modules/@simplewebauthn/server/script";
import { v4 as uuid } from "uuid";

const userRepository = new UserRepository();
const authenticatorRepository = new AuthenticatorRepository();
const authenticator = new Authenticator(
  userRepository,
  authenticatorRepository,
);

interface RegistrationResponse {
  options: PublicKeyCredentialCreationOptionsJSON;
  user: User;
}

export async function generateRegistrationOptions(
  data: FormData,
): Promise<[RegistrationResponse, null] | [null, { error: string }]> {
  try {
    const username = data.get("username") as string;
    if (!username) {
      throw new Error("Username is required");
    }

    const newUser = await userRepository.create({ id: uuid(), username });
    const result = await authenticator.registrationOptions(newUser.id);
    return [{ options: result, user: newUser }, null];
  } catch (error) {
    return [null, { error: (error as Error).message }];
  }
}

interface LoginResponse {
  options: PublicKeyCredentialRequestOptionsJSON;
  user: User;
}

// Generate the options to verify a login
export async function generateLoginOptions(
  data: FormData,
): Promise<[LoginResponse, null] | [null, { error: string }]> {
  try {
    const username = data.get("username") as string;
    if (!username) {
      throw new Error("Username is required");
    }

    const user = await userRepository.findByUsername(username);
    const result = await authenticator.authenticationOptions(user.id);
    return [{ options: result, user: user }, null];
  } catch (error) {
    return [null, { error: (error as Error).message }];
  }
}

export async function verifyRegistration(
  userId: string,
  request: RegistrationResponseJSON,
): Promise<[VerifiedRegistrationResponse, null] | [null, { error: string }]> {
  try {
    const result = await authenticator.register(userId, request);
    return [result.verification, null];
  } catch (error) {
    return [null, { error: (error as Error).message }];
  }
}

export async function verifyLogin(
  userId: string,
  request: AuthenticationResponseJSON,
): Promise<[VerifiedAuthenticationResponse, null] | [null, { error: string }]> {
  try {
    const result = await authenticator.authenticate(userId, request);
    return [result.verification, null];
  } catch (error) {
    return [null, { error: (error as Error).message }];
  }
}
