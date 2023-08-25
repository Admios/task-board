"use client";

import { Column, Task } from "@/model/types";
import { TaskList } from "@/templates/Home/TaskList";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
});

export interface HomeProps {
  initialColumns: Column[];
  initialTasks: Task[];
}

export function Home({ initialColumns, initialTasks }: HomeProps) {
  return (
    <ChakraProvider theme={theme}>
      <DndProvider backend={HTML5Backend}>
        <TaskList initialColumns={initialColumns} initialTasks={initialTasks} />
      </DndProvider>
    </ChakraProvider>
  );
}
