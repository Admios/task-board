"use client";

import { LoginForm } from "./LoginForm";
import { RegistrationForm } from "./RegistrationForm";

export default function ClientSideLoginPage() {
  return (
    <div>
      <h1>Login as an exiting user</h1>
      <LoginForm />

      <h1>Register as a new user</h1>
      <RegistrationForm />
    </div>
  );
}
