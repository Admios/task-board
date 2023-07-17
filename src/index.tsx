import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import App from "./App";
import { CanvasContextProvider } from "./hooks/useCanvas";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <ChakraProvider>
    <CanvasContextProvider>
      <App />
    </CanvasContextProvider>
  </ChakraProvider>
);
