"use server";

import { StateRepository } from "@/model/State";
import { TaskRepository } from "@/model/Task";
import { UserRepository } from "@/model/User";
import { KanbanBoard } from "@/templates/KanbanBoard";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const taskRepository = new TaskRepository();
const stateRepository = new StateRepository();
const userRepository = new UserRepository();

async function getUserFromCookies() {
  const userId = cookies().get("userId")?.value;

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
  params: { boardId: string };
}) {
  const user = await getUserFromCookies();

  if (!user) {
    return redirect("/login");
  }

  const initialStates = await stateRepository.listByBoardId(params.boardId);
  const stateIds = initialStates.map((state) => state.id);
  const initialTasks = await taskRepository.listByStateIdList(stateIds);

  return (
    <KanbanBoard
      boardId={params.boardId}
      initialStates={initialStates}
      initialTasks={initialTasks}
      initialUser={user}
    />
  );
}
