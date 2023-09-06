import { AuthenticatorRepository } from "@/model/Authenticator";
import { UserRepository } from "@/model/User/UserRepository";
import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from "@simplewebauthn/server";

// Human-readable title for your website
const rpName = "SimpleWebAuthn Example";
// A unique identifier for your website
const rpID = "localhost";
// The URL at which registrations and authentications should occur
const originUrl = `https://${rpID}`;

/**
 * Inpired by: https://simplewebauthn.dev/docs/packages/server
 */
export class Authenticator {
  private userRepository: UserRepository;
  private authenticatorRepository: AuthenticatorRepository;

  constructor(
    userRepository: UserRepository,
    authenticatorRepository: AuthenticatorRepository,
  ) {
    this.userRepository = userRepository;
    this.authenticatorRepository = authenticatorRepository;
  }

  async registrationOptions(userId: string) {
    const user = await this.userRepository.findById(userId);
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

    return options;
  }

  async authenticationOptions(userId: string) {
    const user = await this.userRepository.findById(userId);
    const userAuthenticators =
      await this.authenticatorRepository.listByUserId(userId);

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

    return options;
  }

  async register(userId: string, body: any) {
    const user = await this.userRepository.findById(userId);

    if (!user.currentChallenge) {
      throw new Error("No challenge found for user");
    }

    let verification;
    try {
      verification = await verifyRegistrationResponse({
        response: body,
        expectedChallenge: user.currentChallenge,
        expectedOrigin: origin,
        expectedRPID: rpID,
      });
    } catch (error) {
      throw new Error("Registration failed");
    }

    if (!verification.verified || !verification.registrationInfo) {
      throw new Error("Could not verify registration");
    }

    const decoder = new TextDecoder();
    const authenticator = await this.authenticatorRepository.create({
      id: decoder.decode(verification.registrationInfo.credentialID),
      credentialID: verification.registrationInfo.credentialID,
      credentialPublicKey: verification.registrationInfo.credentialPublicKey,
      counter: verification.registrationInfo.counter,
      credentialDeviceType: verification.registrationInfo.credentialDeviceType,
      credentialBackedUp: verification.registrationInfo.credentialBackedUp,
      userId: user.id,
    });

    return { verification, authenticator };
  }

  async authenticate(userId: string, body: any) {
    const user = await this.userRepository.findById(userId);
    const authenticator = await this.authenticatorRepository.findById(body.id);

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
        expectedOrigin: origin,
        expectedRPID: rpID,
        authenticator,
      });
    } catch (error) {
      throw new Error("Authentication failed");
    }

    if (!verification.verified || !verification.authenticationInfo) {
      throw new Error("Could not verify authentication");
    }

    await this.authenticatorRepository.update(authenticator.id, {
      ...authenticator,
      counter: verification.authenticationInfo.newCounter,
    });

    return { verification, authenticator };
  }
}
