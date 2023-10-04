"use client";

import { StateDTO } from "@/model/State";
import { TaskDTO } from "@/model/Task";
import { UserDTO } from "@/model/User";
import { theme } from "@/templates/theme";
import { ChakraProvider } from "@chakra-ui/react";
import { useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Layout } from "./Layout";
import { useZustand } from "./model";

export interface KanbanProps {
  initialStates: StateDTO[];
  initialTasks: TaskDTO[];
  initialUser?: UserDTO;
}

export function KanbanBoard({
  initialStates,
  initialTasks,
  initialUser,
}: KanbanProps) {
  const initialize = useZustand((store) => store.initialize);

  // Initialize zustand with the server-side data
  useEffect(() => {
    initialize(initialTasks, initialStates, initialUser);
  }, [initialStates, initialTasks, initialUser, initialize]);

  return (
    <ChakraProvider theme={theme}>
      <DndProvider backend={HTML5Backend}>
        <Layout />
      </DndProvider>
    </ChakraProvider>
  );
}
