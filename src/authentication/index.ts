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
import { v4 as uuid } from "uuid";

// Human-readable title for your website
const rpName = "SimpleWebAuthn Example";
// A unique identifier for your website
const rpID = "localhost";
// The URL at which registrations and authentications should occur
const originUrl = `http://${rpID}:3000`;

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

  async registrationOptions(newUsername: string) {
    const user = await this.userRepository.create({
      id: uuid(),
      username: newUsername,
    });
    const userAuthenticators = await this.authenticatorRepository.listByUserId(
      user.id,
    );

    const options = await generateRegistrationOptions({
      rpName,
      rpID,
      userID: user.id,
      userName: user.username,
      // Don't prompt users for additional information about the authenticator
      // (Recommended for smoother UX)
      attestationType: "none",
      // Prevent users from re-registering existing authenticators
      excludeCredentials: userAuthenticators.map((authenticator) => ({
        id: authenticator.credentialID,
        type: "public-key",
        // Optional
        transports: authenticator.transports,
      })),
    });

    await this.userRepository.update(user.id, {
      ...user,
      currentChallenge: options.challenge,
    });

    return { options, user };
  }

  async authenticationOptions(username: string) {
    const user = await this.userRepository.findByUsername(username);
    const userAuthenticators = await this.authenticatorRepository.listByUserId(
      user.id,
    );

    const options = await generateAuthenticationOptions({
      allowCredentials: userAuthenticators.map((authenticator) => ({
        id: authenticator.credentialID,
        type: "public-key",
        // Optional
        transports: authenticator.transports,
      })),
      userVerification: "preferred",
    });

    await this.userRepository.update(user.id, {
      ...user,
      currentChallenge: options.challenge,
    });

    return { options, user };
  }

  async register(userId: string, body: RegistrationResponseJSON) {
    const user = await this.userRepository.findById(userId);

    if (!user.currentChallenge) {
      throw new Error("No challenge found for user");
    }

    let verification;
    try {
      verification = await verifyRegistrationResponse({
        response: body,
        expectedChallenge: user.currentChallenge,
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

    const authenticator = await this.authenticatorRepository.create({
      id: uuid(),
      credentialID: verification.registrationInfo.credentialID,
      credentialPublicKey: verification.registrationInfo.credentialPublicKey,
      counter: verification.registrationInfo.counter,
      credentialDeviceType: verification.registrationInfo.credentialDeviceType,
      credentialBackedUp: verification.registrationInfo.credentialBackedUp,
      userId: user.id,
    });

    return { verification, authenticator };
  }

  async authenticate(userId: string, body: AuthenticationResponseJSON) {
    const credentialId = Buffer.from(body.id, "base64url");
    const [user, authenticator] = await Promise.all([
      this.userRepository.findById(userId),
      this.authenticatorRepository.findByCredentialId(credentialId),
    ]);

    if (!authenticator) {
      throw new Error(`Could not find authenticator ${body.id}`);
    }

    // Verify that the authenticator belongs to the correct user
    if (authenticator.userId !== user.id) {
      throw new Error(
        `Could not find authenticator ${body.id} for user ${user.id}`,
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

    await this.authenticatorRepository.update(authenticator.id, {
      ...authenticator,
      counter: verification.authenticationInfo.newCounter,
    });

    return { verification, authenticator };
  }
}
