"use client";

import { StateDTO } from "@/model/State";
import { TaskDTO } from "@/model/Task";
import { UserDTO } from "@/model/User";
import { useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Layout } from "./Layout";
import { useZustand } from "./model";

export interface KanbanProps {
  boardId: string;
  initialStates: StateDTO[];
  initialTasks: TaskDTO[];
  initialUser: UserDTO;
}

export function KanbanBoard({
  boardId,
  initialStates,
  initialTasks,
  initialUser,
}: KanbanProps) {
  const setUser = useZustand((store) => store.setUser);
  const initialize = useZustand((store) => store.initialize);
  const setBoardId = useZustand((store) => store.setBoardId);

  // Initialize zustand with the server-side data
  useEffect(() => {
    initialize(initialTasks, initialStates);
  }, [initialStates, initialTasks, initialize]);

  useEffect(() => {
    setUser(initialUser);
  }, [initialUser, setUser]);

  useEffect(() => {
    setBoardId(boardId);
  }, [boardId, setBoardId]);

  return (
    <DndProvider backend={HTML5Backend}>
      <Layout />
    </DndProvider>
  );
}
