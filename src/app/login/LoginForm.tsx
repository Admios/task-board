import { generateLoginOptions, verifyLogin } from "@/app/authenticationActions";
import { User } from "@/model/types";
import { startAuthentication } from "@simplewebauthn/browser";
import { useState } from "react";

export function LoginForm() {
  const [errorText, setErrorText] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);

  async function login(data: FormData) {
    const [login, error] = await generateLoginOptions(data);
    if (error) {
      setErrorText(error.error);
      return;
    }

    let loginResult;
    try {
      loginResult = await startAuthentication(login.options);
    } catch (e) {
      setErrorText((e as Error).message);
      return;
    }
    const [verification, error2] = await verifyLogin(
      login.user.id,
      loginResult,
    );

    if (error2) {
      setErrorText(error2.error);
      return;
    }

    if (!verification.verified) {
      setErrorText("Login is not verified");
      return;
    }

    setUser(login.user);
    if (verification.registrationInfo) {
      const pk = Buffer.from(
        verification.registrationInfo.credentialPublicKey,
      ).toString("base64");
      setPublicKey(pk);
    }
  }

  return (
    <form action={login}>
      <label htmlFor="username">Username</label>
      <input type="text" name="username" />
      <button type="submit">Login</button>
    </form>
  );
}
