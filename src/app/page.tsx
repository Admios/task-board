"use server";

import { ColumnRepository } from "@/model/Column";
import { TaskRepository } from "@/model/Task";
import { User } from "@/model/types";
import { Home } from "@/templates/Home";
import { cookies } from "next/headers";

const taskRepository = new TaskRepository();
async function getInitialTasks() {
  return taskRepository.list();
}

const columnRepository = new ColumnRepository();
async function getInitialColumns() {
  return columnRepository.list();
}

async function getUserFromCookies(): Promise<User | undefined> {
  const userId = cookies().get("userId")?.value;
  const username = cookies().get("username")?.value;

  if (userId && username) {
    return {
      id: userId,
      username,
    };
  }

  return undefined;
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
