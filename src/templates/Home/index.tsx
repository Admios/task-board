"use client";

import { User } from "@/model/types";
import { Task as DbTask } from "@/pages/api/models/task";
import { Column as DbColumn } from "@/pages/api/models/column";
import { TaskList } from "@/templates/Home/TaskList";
import { theme } from "@/templates/theme";
import { ChakraProvider } from "@chakra-ui/react";
import { useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useZustand } from "./state";

export interface HomeProps {
  initialColumns: DbColumn[];
  initialTodos: DbTask[];
  initialUser?: User;
}

export function Home({ initialColumns, initialTodos, initialUser }: HomeProps) {
  const initialize = useZustand((store) => store.initialize);

  // Initialize zustand with the server-side data
  useEffect(() => {
    initialize(initialTodos, initialColumns, initialUser);
  }, [initialColumns, initialTodos, initialUser, initialize]);

  return (
    <ChakraProvider theme={theme}>
      <DndProvider backend={HTML5Backend}>
        <TaskList />
      </DndProvider>
    </ChakraProvider>
  );
}
