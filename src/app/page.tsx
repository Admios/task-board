"use client";

import { User } from "@/model/types";
import { Home } from "@/templates/Home";
import { useEffect, useState } from "react";

export default function RootPage() {
  const [user, setUser] = useState<User | undefined>();
  const [initialColumns, setInitialColumns] = useState([]);
  const [initialTasks, setInitialTasks] = useState([]);

  useEffect(() => {
    fetch("/auth/user").then(async (response) => {
      if (response.status === 200) {
        setUser(await response.json());
      }
    });
  }, []);

  useEffect(() => {
    fetch("/auth/initialData").then(async (response) => {
      if (response.status === 200) {
        const { columns, tasks } = await response.json();
        setInitialColumns(columns);
        setInitialTasks(tasks);
      }
    });
  }, []);

  return (
    <Home
      initialColumns={initialColumns}
      initialTodos={initialTasks}
      initialUser={user}
    />
  );
}
