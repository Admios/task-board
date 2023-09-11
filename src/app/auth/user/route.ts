import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const userId = cookies().get("userId")?.value;
  const username = cookies().get("username")?.value;

  if (userId && username) {
    return {
      id: userId,
      username,
    };
  }

  return NextResponse.json({ error: "Not logged in" }, { status: 401 });
}
