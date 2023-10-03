"use client";

import { StateDTO } from "@/model/State";
import { TaskDTO } from "@/model/Task";
import { UserDTO } from "@/model/User";
import { TaskList } from "@/templates/Home/TaskList";
import { theme } from "@/templates/theme";
import { ChakraProvider } from "@chakra-ui/react";
import { useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useZustand } from "./model";

export interface HomeProps {
  initialStates: StateDTO[];
  initialTasks: TaskDTO[];
  initialUser?: UserDTO;
}

export function Home({ initialStates, initialTasks, initialUser }: HomeProps) {
  const initialize = useZustand((store) => store.initialize);

  // Initialize zustand with the server-side data
  useEffect(() => {
    initialize(initialTasks, initialStates, initialUser);
  }, [initialStates, initialTasks, initialUser, initialize]);

  return (
    <ChakraProvider theme={theme}>
      <DndProvider backend={HTML5Backend}>
        <TaskList />
      </DndProvider>
    </ChakraProvider>
  );
}
