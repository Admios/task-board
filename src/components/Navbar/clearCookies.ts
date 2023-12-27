"use server";

import { cookies } from "next/headers";

export async function clearCookies() {
  cookies()
    .getAll()
    .forEach((cookie) => {
      cookies().delete(cookie.name);
    });
}
