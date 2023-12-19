import { clsx } from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { clearCookies } from "./clearCookies";
import { useZustand } from "./model";

interface BrandProps {
  isMobileMenuActive: boolean;
  setIsMobileMenuActive(value: boolean): void;
}

function Brand({ isMobileMenuActive, setIsMobileMenuActive }: BrandProps) {
  return (
    <div className="navbar-brand">
      <Link className="navbar-item" href="/">
        <Image src="admios-logo.svg" alt="Logo" width="112" height="28" />
      </Link>

      <a
        role="button"
        className={clsx("navbar-burger", isMobileMenuActive && "is-active")}
        aria-label="menu"
        aria-expanded="false"
        data-target="main-navbar-inner"
        onClick={() => setIsMobileMenuActive(!isMobileMenuActive)}
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </a>
    </div>
  );
}

interface NavbarProps {
  onOpenStateDialog(): void;
}

export function Navbar({ onOpenStateDialog }: NavbarProps) {
  const user = useZustand((store) => store.user);
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
            Board
          </Link>

          <a className="navbar-item" onClick={onOpenStateDialog}>
            Add State
          </a>
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
