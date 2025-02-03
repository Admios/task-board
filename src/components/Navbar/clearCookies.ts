"use server";

import { cookies } from "next/headers";

export async function clearCookies() {
  const allCookies = await cookies();
  allCookies.getAll().forEach((cookie) => {
    allCookies.delete(cookie.name);
  });
}
