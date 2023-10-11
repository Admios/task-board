import { AuthenticatorRepository } from "@/model/Authenticator";
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

  constructor(
    userRepository: UserRepository,
    authenticatorRepository: AuthenticatorRepository,
  ) {
    this.userRepository = userRepository;
    this.authenticatorRepository = authenticatorRepository;
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
      options = await this.registrationOptions(email);
    }

    await this.userRepository.update({
      email,
      currentChallenge: options.challenge,
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

    if (isRegistrationResponse(body)) {
      // Response from "Registration" step.
      return this.register(email, body);
    } else {
      // Response from "Authentication" step.
      return this.authenticate(email, body);
    }
  }

  private async registrationOptions(email: string) {
    await this.userRepository.create({ email });
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
    const { currentChallenge } = await this.userRepository.findById(email);

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

    if (!verification.registrationInfo) {
      throw new Error("Registration has no verification info");
    }

    await this.authenticatorRepository.createFromRegistration(
      email,
      verification.registrationInfo,
    );

    return verification;
  }

  private async authenticate(userId: string, body: AuthenticationResponseJSON) {
    const [user, authenticator] = await Promise.all([
      this.userRepository.findById(userId),
      this.authenticatorRepository.findById(body.id),
    ]);

    // Verify that the authenticator belongs to the correct user
    if (authenticator.userId !== user.email) {
      throw new Error(
        `Could not find authenticator ${body.id} for user ${user.email}`,
      );
    }

    if (!user.currentChallenge) {
      throw new Error("No challenge found for user");
    }

    let verification;
    try {
      verification = await verifyAuthenticationResponse({
        response: body,
        expectedChallenge: user.currentChallenge,
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
