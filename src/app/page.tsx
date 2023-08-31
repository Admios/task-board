"use server";

import { ColumnRepository } from "@/model/Column";
import { TaskRepository } from "@/model/Task";
import { Home } from "@/templates/Home";

const taskRepository = new TaskRepository();
async function getInitialTasks() {
  return taskRepository.list();
}

const columnRepository = new ColumnRepository();
async function getInitialColumns() {
  return columnRepository.list();
}

export default async function ServerSideHomePage() {
  const initialColumns = await getInitialColumns();
  const initialTasks = await getInitialTasks();

  return <Home initialColumns={initialColumns} initialTodos={initialTasks} />;
}
