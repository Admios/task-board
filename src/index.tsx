import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import App from "./App";
import { TodoListContextProvider } from "./context/TodoListContext";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
});

root.render(
  <ChakraProvider theme={theme}>
    <DndProvider backend={HTML5Backend}>
      <TodoListContextProvider>
        <App />
      </TodoListContextProvider>
    </DndProvider>
  </ChakraProvider>
);
