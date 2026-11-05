"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isCurrentNav, navItems } from "../../lib/nav";
import styles from "./Footer.module.scss";

export default function FooterNav() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav} aria-label="フッターナビゲーション">
      {navItems.map((item) => {
        const isActive = isCurrentNav(item, pathname);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.link} ${isActive ? styles.active : ""}`}
            aria-current={isActive ? "page" : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
