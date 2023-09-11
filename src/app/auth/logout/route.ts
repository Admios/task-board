import { cookies } from "next/headers";

export async function POST() {
  cookies()
    .getAll()
    .forEach((cookie) => {
      cookies().delete(cookie.name);
    });
}
