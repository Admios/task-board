"use server";

import { StateRepository } from "@/model/State";
import { TaskRepository } from "@/model/Task";
import { UserRepository } from "@/model/User";
import { KanbanBoard } from "@/templates/KanbanBoard";
import { NextPage } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const taskRepository = new TaskRepository();
const stateRepository = new StateRepository();
const userRepository = new UserRepository();

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

export default async function ServerSideBoardpage({
  params,
}: {
  params: Promise<{ boardId: string }>;
}) {
  const user = await getUserFromCookies();

  if (!user) {
    return redirect("/login");
  }

  const { boardId } = await params;
  const initialStates = await stateRepository.listByBoardId(boardId);
  const stateIds = initialStates.map((state) => state.id);
  const initialTasks = await taskRepository.listByStateIdList(stateIds);

  return (
    <KanbanBoard
      boardId={boardId}
      initialStates={initialStates}
      initialTasks={initialTasks}
      initialUser={user}
    />
  );
}
