"use server";

import { ColumnRepository } from "@/model/Column";
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

const columnRepository = new ColumnRepository();
async function getInitialColumns() {
  const userId = cookies().get("userId")?.value;
  if (!userId) {
    return [];
  }
  return columnRepository.listByUserId(userId);
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
  const [initialColumns, initialTasks, user] = await Promise.all([
    getInitialColumns(),
    getInitialTasks(),
    getUserFromCookies(),
  ]);

  return (
    <Home
      initialColumns={initialColumns}
      initialTodos={initialTasks}
      initialUser={user}
    />
  );
}
