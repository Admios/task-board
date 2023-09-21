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

  async registrationOptions(username: string) {
    await this.userRepository.create({ username });
    // const userAuthenticators =
    //   await this.authenticatorRepository.listByUserId(newId);

    const options = await generateRegistrationOptions({
      rpName,
      rpID,
      userID: username,
      userName: username,
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

    await this.userRepository.update({
      username,
      currentChallenge: options.challenge,
    });

    return { options, username };
  }

  async authenticationOptions(username: string) {
    const userAuthenticators =
      await this.authenticatorRepository.listByUserId(username);

    const options = await generateAuthenticationOptions({
      allowCredentials: userAuthenticators.map((authenticator) => ({
        id: authenticator.credentialID,
        type: "public-key",
        // Optional
        transports: authenticator.transports,
      })),
      userVerification: "preferred",
    });

    await this.userRepository.update({
      username,
      currentChallenge: options.challenge,
    });

    return { options, username };
  }

  async register(username: string, body: RegistrationResponseJSON) {
    const { currentChallenge } = await this.userRepository.findById(username);

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

    const authenticator = await this.authenticatorRepository.create({
      credentialID: verification.registrationInfo.credentialID,
      credentialPublicKey: verification.registrationInfo.credentialPublicKey,
      counter: verification.registrationInfo.counter,
      credentialDeviceType: verification.registrationInfo.credentialDeviceType,
      credentialBackedUp: verification.registrationInfo.credentialBackedUp,
      userId: username,
    });

    return { verification, authenticator };
  }

  async authenticate(userId: string, body: AuthenticationResponseJSON) {
    const [user, authenticator] = await Promise.all([
      this.userRepository.findById(userId),
      this.authenticatorRepository.findById(body.id),
    ]);

    if (!authenticator) {
      throw new Error(`Could not find authenticator ${body.id}`);
    }

    // Verify that the authenticator belongs to the correct user
    if (authenticator.userId !== user.username) {
      throw new Error(
        `Could not find authenticator ${body.id} for user ${user.username}`,
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

    return { verification, authenticator };
  }
}
