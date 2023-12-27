import { clsx } from "clsx";
import Image from "next/image";
import Link from "next/link";

interface BrandProps {
  isMobileMenuActive: boolean;
  setIsMobileMenuActive(value: boolean): void;
}

export function Brand({
  isMobileMenuActive,
  setIsMobileMenuActive,
}: BrandProps) {
  return (
    <div className="navbar-brand">
      <Link className="navbar-item" href="/">
        <Image src="/admios-logo.svg" alt="Logo" width="112" height="28" />
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
