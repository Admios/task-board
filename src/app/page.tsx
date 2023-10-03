"use server";

import { StateRepository } from "@/model/State";
import { TaskRepository } from "@/model/Task";
import { UserRepository } from "@/model/User";
import { Home } from "@/templates/Home";
import { cookies } from "next/headers";

const taskRepository = new TaskRepository();
async function getInitialTasks() {
  const userId = cookies().get("userId")?.value;
  if (!userId) {
    return [];
  }
  return taskRepository.listByUserId(userId);
}

const stateRepository = new StateRepository();
async function getInitialStates() {
  const userId = cookies().get("userId")?.value;
  if (!userId) {
    return [];
  }
  return stateRepository.listByUserId(userId);
}

const userRepository = new UserRepository();
async function getUserFromCookies() {
  const userId = cookies().get("userId")?.value;

  if (!userId) {
    return undefined;
  }

  try {
    const user = await userRepository.findById(userId);
    return user;
  } catch (error) {
    return undefined;
  }
}

export default async function ServerSideHomePage() {
  const [initialStates, initialTasks, user] = await Promise.all([
    getInitialStates(),
    getInitialTasks(),
    getUserFromCookies(),
  ]);

  return (
    <Home
      initialStates={initialStates}
      initialTasks={initialTasks}
      initialUser={user}
    />
  );
}
