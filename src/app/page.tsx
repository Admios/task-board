"use server";

import { BoardRepository } from "@/model/Board";
import { UserRepository } from "@/model/User";
import { BoardList } from "@/templates/BoardList";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const boardRepository = new BoardRepository();
const userRepository = new UserRepository();

async function getInitialBoards(userId: string) {
  return boardRepository.listByUserId(userId);
}

async function getUserFromCookies() {
  const currentCookies = await cookies();
  const userId = currentCookies.get("userId")?.value;

  if (!userId) {
    return undefined;
  }

  try {
    return await userRepository.findById(userId);
  } catch (error) {
    return undefined;
  }
}

export default async function ServerSideHomePage() {
  const user = await getUserFromCookies();

  if (!user) {
    return redirect("/login");
  }

  const boards = await getInitialBoards(user.email);
  return <BoardList user={user} boards={boards} />;
}
