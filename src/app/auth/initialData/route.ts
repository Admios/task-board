import { ColumnRepository } from "@/model/Column";
import { TaskRepository } from "@/model/Task";
import { NextResponse } from "next/server";

const taskRepository = new TaskRepository();
const columnRepository = new ColumnRepository();

export async function GET() {
  const [columns, tasks] = await Promise.all([
    columnRepository.list(),
    taskRepository.list(),
  ]);

  return NextResponse.json({ columns, tasks });
}
