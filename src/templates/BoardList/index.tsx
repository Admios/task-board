"use server";

import { BoardDTO } from "@/model/Board";
import Link from "next/link";

interface BoardListProps {
  boards: BoardDTO[];
}

export async function BoardList({ boards }: BoardListProps) {
  return (
    <>
      Your Boards:
      <ul>
        {boards.map((board) => (
          <li key={board.id}>
            <Link href={`/b/${board.id}`}>{board.name}</Link>
          </li>
        ))}
      </ul>
    </>
  );
}
