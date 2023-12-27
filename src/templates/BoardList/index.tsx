"use server";

import { BoardDTO } from "@/model/Board";
import Link from "next/link";
import styles from "./index.module.scss";

interface BoardListProps {
  boards: BoardDTO[];
}

export async function BoardList({ boards }: BoardListProps) {
  return (
    <main className={styles.main}>
      <section className="container">
        <h1 className="title">Your Boards</h1>
        <ul>
          <li>
            <Link href={`/b/1`}>Test Board</Link>
          </li>
        </ul>
      </section>
    </main>
  );
}
