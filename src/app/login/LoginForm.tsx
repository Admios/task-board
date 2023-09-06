import { generateLoginOptions, verifyLogin } from "@/app/authenticationActions";
import { User } from "@/model/types";
import { startAuthentication } from "@simplewebauthn/browser";
import { useState } from "react";

export function LoginForm() {
  const [errorText, setErrorText] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  async function login(data: FormData) {
    try {
      const { user, options } = await generateLoginOptions(data);
      const loginResult = await startAuthentication(options);
      const { verification } = await verifyLogin(user.id, loginResult);

      if (!verification.verified) {
        throw new Error("Login is not verified");
      }

      setUser(user);
    } catch (e) {
      setErrorText((e as Error).message);
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
        <h1>User Logged In</h1>
        <p>Username: {user.username}</p>
      </div>
    );
  }

  return (
    <form action={login}>
      <label htmlFor="username">Username</label>
      <input type="text" name="username" />
      <button type="submit">Login</button>
    </form>
  );
}
