"use client";

import { UserDTO } from "@/model/User";
import { clsx } from "clsx";
import { useRouter } from "next/navigation";
import { doCreateDefaultBoard } from "./createBoard";
import classes from "./index.module.scss";

export function Empty() {
  const router = useRouter();

  async function createBoard() {
    await doCreateDefaultBoard();
    router.refresh();
  }

  return (
    <div className={clsx("container", classes.emptyContainer)}>
      <div className={clsx("card", classes.emptyContent)}>
        <header className="card-header">
          <p className="card-header-title">You do not have any boards yet.</p>
        </header>

        <div className="card-content">
          <div className="content">
            <p>
              Create one to get started! Your first board will already include
              some default columns.
            </p>
          </div>
        </div>

        <footer className="card-footer">
          <a className="card-footer-item" onClick={createBoard}>
            Create Board
          </a>
        </footer>
      </div>
    </div>
  );
}
