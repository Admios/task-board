"use client";

import { TodoListContextProvider } from "@/context/TodoListContext";
import Home from "@/templates/Home";
import { Box, ChakraProvider, extendTheme } from "@chakra-ui/react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
});

export default function HomePage() {
  return (
    <ChakraProvider theme={theme}>
      <Box>
        <DndProvider backend={HTML5Backend}>
          <TodoListContextProvider>
            <Home />
          </TodoListContextProvider>
        </DndProvider>
      </Box>
    </ChakraProvider>
  );
}
