"use client";

import { User } from "@/model/types";
import { startRegistration } from "@simplewebauthn/browser";
import { useState } from "react";
import {
  generateRegistrationOptions,
  verifyRegistration,
} from "@/app/authenticationActions";

export function RegistrationForm() {
  const [errorText, setErrorText] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);

  async function register(data: FormData) {
    const [registration, error1] = await generateRegistrationOptions(data);
    if (error1) {
      setErrorText(error1.error);
      return;
    }

    let registrationResult;
    try {
      registrationResult = await startRegistration(registration.options);
    } catch (e) {
      setErrorText((e as Error).message);
      return;
    }
    const [verification, error2] = await verifyRegistration(
      registration.user.id,
      registrationResult,
    );

    if (error2) {
      setErrorText(error2.error);
      return;
    }

    if (!verification.verified) {
      setErrorText("Registration is not verified");
      return;
    }

    setUser(registration.user);
    if (verification.registrationInfo) {
      const pk = Buffer.from(
        verification.registrationInfo.credentialPublicKey,
      ).toString("base64");
      setPublicKey(pk);
    }
  }

  if (errorText) {
    return (
      <div>
        <h1>Error</h1>
        <p>{errorText}</p>
      </div>
    );
  }

  if (user) {
    return (
      <div>
        <h1>User Registered</h1>
        <p>Username: {user.username}</p>
        {publicKey && <p>Public Key: {publicKey}</p>}
      </div>
    );
  }

  return (
    <form action={register}>
      <label htmlFor="username">Username</label>
      <input type="text" name="username" id="username" />

      <button type="submit">Register</button>
    </form>
  );
}
