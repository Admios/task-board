import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { clearCookies } from "./clearCookies";
import { useZustand } from "./model";

interface HeaderProps {
  onOpenStateDialog(): void;
}

export function Header({ onOpenStateDialog }: HeaderProps) {
  const user = useZustand((store) => store.user);
  const router = useRouter();

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
      </div>

      <div id="main-navbar-inner" className="navbar-menu">
        <div className="navbar-start">
          <Link className="navbar-item" href="/">
            Board
          </Link>

          <a className="navbar-item" onClick={onOpenStateDialog}>
            Add State
          </a>
        </div>
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
    </nav>
  );
}
