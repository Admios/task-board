import { AuthenticationChallengeRepository } from "@/model/AuthenticationChallenge";
import { AuthenticatorRepository } from "@/model/Authenticator";
import { mapper } from "@/model/CassandraClient";
import { UserRepository } from "@/model/User/UserRepository";
import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from "@simplewebauthn/server";
import {
  AuthenticationResponseJSON,
  RegistrationResponseJSON,
} from "@simplewebauthn/typescript-types";

// Human-readable title for your website
const rpName = "SimpleWebAuthn Example";
// A unique identifier for your website
const rpID = "localhost";
// The URL at which registrations and authentications should occur
const originUrl = `http://${rpID}:3000`;

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isRegistrationResponse(
  body: RegistrationResponseJSON | AuthenticationResponseJSON,
): body is RegistrationResponseJSON {
  return "publicKey" in body.response;
}

/**
 * Inspired by: https://simplewebauthn.dev/docs/packages/server
 */
export class PasskeyAuthenticationFlow {
  private userRepository: UserRepository;
  private authenticatorRepository: AuthenticatorRepository;
  private authenticatorChallengeRepository: AuthenticationChallengeRepository;

  constructor(
    userRepository: UserRepository,
    authenticatorRepository: AuthenticatorRepository,
    authenticatorChallengeRepository: AuthenticationChallengeRepository,
  ) {
    this.userRepository = userRepository;
    this.authenticatorRepository = authenticatorRepository;
    this.authenticatorChallengeRepository = authenticatorChallengeRepository;
  }

  /**
   * Step 1: generate a cryptographic challenge for the user to solve in their browser
   */
  async generateOptions(email: string) {
    if (!isValidEmail(email)) {
      throw new Error("Invalid email address");
    }

    let options;
    try {
      await this.userRepository.findById(email);
      // User exists, so we should authenticate it
      options = await this.authenticationOptions(email);
    } catch (error) {
      // User doesn't exist, so we should register it
      if (
        error instanceof Error &&
        error?.message &&
        error.message === "User  not found"
      ) {
        options = await this.registrationOptions(email);
      } else {
        throw error;
      }
    }

    // Note: `update` creates the registry if it doesn't exist
    await this.authenticatorChallengeRepository.update({
      id: email,
      challenge: options.challenge,
    });

    return options;
  }

  /**
   * Step 2: verify that the challenge was solved correctly
   */
  async verifyOptions(
    email: string,
    body: RegistrationResponseJSON | AuthenticationResponseJSON,
  ) {
    if (!isValidEmail(email)) {
      throw new Error("Invalid email address");
    }

    let result;
    if (isRegistrationResponse(body)) {
      // Response from "Registration" step.
      result = await this.register(email, body);
    } else {
      // Response from "Authentication" step.
      result = await this.authenticate(email, body);
    }

    await this.authenticatorChallengeRepository.delete(email);
    return result;
  }

  private async registrationOptions(email: string) {
    // const userAuthenticators =
    //   await this.authenticatorRepository.listByUserId(newId);
    return generateRegistrationOptions({
      rpName,
      rpID,
      userID: email,
      userName: email,
      // Don't prompt users for additional information about the authenticator
      // (Recommended for smoother UX)
      attestationType: "none",
      // Prevent users from re-registering existing authenticators
      // excludeCredentials: userAuthenticators.map((authenticator) => ({
      //   id: authenticator.credentialID,
      //   type: "public-key",
      //   // Optional
      //   transports: authenticator.transports,
      // })),
    });
  }

  private async authenticationOptions(email: string) {
    const userAuthenticators =
      await this.authenticatorRepository.listByUserId(email);

    return generateAuthenticationOptions({
      allowCredentials: userAuthenticators.map((authenticator) => ({
        id: authenticator.credentialID,
        type: "public-key",
        // Optional
        transports: authenticator.transports,
      })),
      userVerification: "preferred",
    });
  }

  private async register(email: string, body: RegistrationResponseJSON) {
    const { challenge: currentChallenge } =
      await this.authenticatorChallengeRepository.findById(email);

    if (!currentChallenge) {
      throw new Error("No challenge found for user");
    }

    let verification;
    try {
      verification = await verifyRegistrationResponse({
        response: body,
        expectedChallenge: currentChallenge,
        expectedOrigin: originUrl,
        expectedRPID: rpID,
      });
    } catch (error) {
      throw new Error(`Registration failed: ${(error as Error).message}`);
    }

    if (!verification.verified) {
      throw new Error("Registration is not verified");
    }

    const newAuthenticator = AuthenticatorRepository.fromRegistration(
      email,
      verification,
    );
    await mapper.batch([
      this.userRepository.mapper.batching.insert({ email }),
      this.authenticatorRepository.mapper.batching.insert(newAuthenticator),
    ]);

    return verification;
  }

  private async authenticate(userId: string, body: AuthenticationResponseJSON) {
    const [user, authenticator, challenge] = await Promise.all([
      this.userRepository.findById(userId),
      this.authenticatorRepository.findById(body.id),
      this.authenticatorChallengeRepository.findById(userId),
    ]);

    // Verify that the authenticator belongs to the correct user
    if (authenticator.userId !== user.email) {
      throw new Error(
        `Could not find authenticator ${body.id} for user ${user.email}`,
      );
    }

    if (!challenge.challenge) {
      throw new Error("No challenge found for user");
    }

    let verification;
    try {
      verification = await verifyAuthenticationResponse({
        response: body,
        expectedChallenge: challenge.challenge,
        expectedOrigin: originUrl,
        expectedRPID: rpID,
        authenticator,
      });
    } catch (error) {
      throw new Error(`Authentication failed: ${(error as Error).message}`);
    }

    if (!verification.verified) {
      throw new Error("Could not verify authentication");
    }

    if (!verification.authenticationInfo) {
      throw new Error("Authentication has no verification info");
    }

    await this.authenticatorRepository.update({
      ...authenticator,
      counter: verification.authenticationInfo.newCounter,
    });

    return verification;
  }
}
