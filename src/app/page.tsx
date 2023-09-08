"use server";

import { User } from "@/model/types";
import { Home } from "@/templates/Home";
import { cookies } from "next/headers";

const fetcher = (query: string) =>
  fetch("http://localhost:3000/api/graphql", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ query }),
  })
    .then((res) => res.json())
    .then((json) => json.data);

async function getInitialTasks() {
  const {tasks}= await fetcher(`
  {
    tasks {
      id
      text
      columnId
      position
    }
  }
  `);
  return tasks;
}

async function getInitialColumns() {
  const {columns} = await fetcher(`
  {
    columns {
      id
      name
      position
      color
    }
  }
  `);
  return columns;
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
