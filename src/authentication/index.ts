import { AuthenticationChallengeRepository } from "@/model/AuthenticationChallenge";
import { AuthenticatorRepository } from "@/model/Authenticator";
import { transaction } from "@/model/SqliteClient";
import { UserRepository } from "@/model/User/UserRepository";
import {
    AuthenticationResponseJSON,
    generateAuthenticationOptions,
    generateRegistrationOptions,
    RegistrationResponseJSON,
    verifyAuthenticationResponse,
    verifyRegistrationResponse,
} from "@simplewebauthn/server";

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
      this.userRepository.findById(email);
      // User exists, so we should authenticate it
      options = await this.authenticationOptions(email);
    } catch (error) {
      // User doesn't exist, so we should register it
      options = await this.registrationOptions(email);
    }

    // The challenge row doesn't exist yet for a brand-new user, and may
    // already exist for a returning one retrying a failed login attempt —
    // this is the one place in the app that genuinely needs upsert
    // semantics, since we can't know in advance which case applies.
    this.authenticatorChallengeRepository.upsert({
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

    this.authenticatorChallengeRepository.delete(email);
    return result;
  }

  private async registrationOptions(email: string) {
    // const userAuthenticators =
    //   this.authenticatorRepository.listByUserId(newId);
    return generateRegistrationOptions({
      rpName,
      rpID,
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
    const userAuthenticators = this.authenticatorRepository.listByUserId(email);

    return generateAuthenticationOptions({
      rpID,
      allowCredentials: userAuthenticators.map((authenticator) => ({
        id: authenticator.credentialID,
        // Optional
        transports: authenticator.transports,
      })),
      userVerification: "preferred",
    });
  }

  private async register(email: string, body: RegistrationResponseJSON) {
    const { challenge: currentChallenge } =
      this.authenticatorChallengeRepository.findById(email);

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

    // Both rows are brand new — the user lookup at the top of
    // generateOptions() already established this email isn't registered —
    // so this is a real INSERT, not an upsert. `create` throws loudly on
    // the (very unlikely) race of a duplicate registration instead of
    // silently overwriting an existing account's authenticator.
    const newAuthenticator = AuthenticatorRepository.fromRegistration(
      email,
      verification,
    );
    transaction(() => {
      this.userRepository.create({ email });
      this.authenticatorRepository.create(newAuthenticator);
    });

    return verification;
  }

  private async authenticate(userId: string, body: AuthenticationResponseJSON) {
    const user = this.userRepository.findById(userId);
    const authenticator = this.authenticatorRepository.findById(body.id);
    const challenge = this.authenticatorChallengeRepository.findById(userId);

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
        credential: {
          id: authenticator.credentialID,
          publicKey: authenticator.credentialPublicKey,
          counter: authenticator.counter,
          transports: authenticator.transports,
        },
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

    this.authenticatorRepository.update({
      ...authenticator,
      counter: verification.authenticationInfo.newCounter,
    });

    return verification;
  }
}
