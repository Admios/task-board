"use client";

import { Navbar } from "@/components/Navbar";
import { BoardDTO } from "@/model/Board";
import { UserDTO } from "@/model/User";
import { ChartBarIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import styles from "./index.module.scss";

interface BoardListProps {
  user: UserDTO;
  boards: BoardDTO[];
}

export function BoardList({ boards, user }: BoardListProps) {
  return (
    <main className={styles.main}>
      <Navbar user={user} navbarItems={[]} />

      <section className="container">
        <nav className="panel is-primary">
          <p className="panel-heading">Your Boards</p>

          <Link className="panel-block is-active" href={`/b/1`}>
            <span className="panel-icon">
              <ChartBarIcon />
            </span>
            Test Board
          </Link>
        </nav>
      </section>
    </main>
  );
}
