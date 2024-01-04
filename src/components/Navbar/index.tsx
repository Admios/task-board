"use client";

import { UserDTO } from "@/model/User";
import { clsx } from "clsx";
import Link from "next/link";
import { useState } from "react";
import { Brand } from "./Brand";
import { clearCookies } from "./clearCookies";

interface NavbarProps {
  onAddState?(): void;
  user?: UserDTO;
}

export function Navbar({ onAddState, user }: NavbarProps) {
  const [isMobileMenuActive, setIsMobileMenuActive] = useState(false);

  async function handleLogout() {
    await clearCookies();
  }

  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <Brand
        isMobileMenuActive={isMobileMenuActive}
        setIsMobileMenuActive={setIsMobileMenuActive}
      />

      <div
        id="main-navbar-inner"
        className={clsx("navbar-menu", isMobileMenuActive && "is-active")}
      >
        <div className="navbar-start">
          <Link className="navbar-item" href="/">
            My Boards
          </Link>

          {onAddState && (
            <a className="navbar-item" onClick={onAddState}>
              Add State
            </a>
          )}
        </div>

        <div className="navbar-end">
          <div className="navbar-item">
            Username: {user?.email ? user.email : "guest"}
          </div>
          {user ? (
            <a className="navbar-item" onClick={handleLogout}>
              Logout
            </a>
          ) : (
            <Link className="navbar-item" href="/login">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
