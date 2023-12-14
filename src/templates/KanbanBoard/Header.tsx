import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { clearCookies } from "./clearCookies";
import { useZustand } from "./model";

interface HeaderProps {
  onOpenStateDialog?: () => void;
}

export function Header({ onOpenStateDialog }: HeaderProps) {
  const user = useZustand((store) => store.user);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  function handleLogin() {
    router.push("/login");
  }

  async function handleLogout() {
    await clearCookies();
  }

  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <Link className="navbar-item" href="/">
          <Image src="admios-logo.svg" alt="Logo" width="112" height="28" />
        </Link>

        <a
          role="button"
          className="navbar-burger"
          aria-label="menu"
          aria-expanded="false"
          data-target="main-navbar-inner"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>

        <div id="main-navbar-inner" className="navbar-menu">
          <div className="navbar-start">
            <Link className="navbar-link" href="/">
              Board
            </Link>

            <a className="navbar-item" onClick={onOpenStateDialog}>
              Add State
            </a>

            <div className="navbar-item has-dropdown is-hoverable">
              <a className="navbar-link">Account</a>
              <div className="navbar-dropdown">
                <a className="navbar-item">
                  {user?.email ? user.email : "guest"}
                </a>
                {user ? (
                  <a className="navbar-item" onClick={handleLogout}>
                    Logout
                  </a>
                ) : (
                  <a className="navbar-item" onClick={handleLogin}>
                    Login
                  </a>
                )}
                <a className="navbar-item">Contact</a>
                <hr className="navbar-divider" />
                <a className="navbar-item">Report an issue</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
