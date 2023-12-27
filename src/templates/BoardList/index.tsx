"use server";

import { Navbar } from "@/components/Navbar";
import { BoardDTO } from "@/model/Board";
import { UserDTO } from "@/model/User";
import Link from "next/link";
import styles from "./index.module.scss";

interface BoardListProps {
  user: UserDTO;
  boards: BoardDTO[];
}

export async function BoardList({ boards, user }: BoardListProps) {
  return (
    <main className={styles.main}>
      <Navbar user={user} navbarItems={[]} />

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
