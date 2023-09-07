"use client";

import { Column as DbColumn, Task as DbTask } from "@/model/types";
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
}

export function Home({ initialColumns, initialTodos }: HomeProps) {
  const initialize = useZustand((store) => store.initialize);

  // Initialize zustand with the server-side data
  useEffect(() => {
    initialize(initialTodos, initialColumns);
  }, [initialColumns, initialTodos, initialize]);

  return (
    <ChakraProvider theme={theme}>
      <DndProvider backend={HTML5Backend}>
        <TaskList />
      </DndProvider>
    </ChakraProvider>
  );
}
