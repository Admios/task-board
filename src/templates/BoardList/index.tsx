"use client";

import { Navbar } from "@/components/Navbar";
import { BoardDTO } from "@/model/Board";
import { UserDTO } from "@/model/User";
import { ChartBarIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { Empty } from "./Empty";
import styles from "./index.module.scss";

interface BoardListProps {
  user: UserDTO;
  boards: BoardDTO[];
}

export function BoardList({ boards, user }: BoardListProps) {
  return (
    <main className={styles.main}>
      <Navbar user={user} />

      {boards.length === 0 ? (
        <Empty />
      ) : (
        <section className="container" title="boards-list">
          <nav className="panel is-primary">
            <p className="panel-heading">Your Boards</p>

            {boards.map((board) => (
              <Link
                className="panel-block is-active"
                key={board.id}
                href={`/b/${board.id}`}
              >
                <span className="panel-icon">
                  <ChartBarIcon />
                </span>
                {board.name}
              </Link>
            ))}
          </nav>
        </section>
      )}
    </main>
  );
}
