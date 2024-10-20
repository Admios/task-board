"use client";

import {
  startAuthentication,
  startRegistration,
} from "@simplewebauthn/browser";
import { clsx } from "clsx";
import { useRouter } from "next/navigation";
import { useState } from "react";
import classes from "./index.module.css";
import { generateOptions, verifyOptions } from "./serverActions";

async function authorize(email: string): Promise<boolean> {
  const options = await generateOptions(email);
  const authorization =
    "pubKeyCredParams" in options
      ? await startRegistration(options)
      : await startAuthentication(options);

  const verification = await verifyOptions(email, authorization);
  return verification.verified;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function Login() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [errorText, setErrorText] = useState<string | null>(null);
  const router = useRouter();

  async function authorizationFlow() {
    if (isLoading) {
      return;
    }

    setIsLoading(true);

    try {
      if (!email) {
        throw new Error("Email is required");
      }
      if (!isValidEmail(email)) {
        throw new Error("Email is not valid");
      }

      const isVerified = await authorize(email);
      if (!isVerified) {
        throw new Error("Key could not verified by the server");
      }

      router.push("/");
    } catch (e) {
      setErrorText((e as Error).message);
    }

    setIsLoading(false);
  }

  return (
    <main className={classes.pageContainer}>
      <div className={clsx("card", classes.card)}>
        <header className="card-header">
          <p className="card-header-title">Login or Register</p>
        </header>

        <article className="card-content">
          <div className="content">
            {errorText && (
              <article className="message is-danger" role="alert">
                <header className="message-header">
                  <p>There was an error</p>
                </header>
                <div className="message-body">{errorText}</div>
              </article>
            )}

            <section className="field">
              <label className="label">Email</label>
              <div className="control">
                <input
                  className="input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </section>
          </div>
        </article>

        <footer className="card-footer">
          <a
            className="card-footer-item"
            onClick={authorizationFlow}
            role="button"
          >
            Authorize Me
          </a>
        </footer>
      </div>
    </main>
  );
}
