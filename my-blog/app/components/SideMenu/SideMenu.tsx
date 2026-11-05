"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { isCurrentNav, navItems, snsLinks, type NavItem } from "../../lib/nav";
import styles from "./SideMenu.module.scss";

export default function SideMenu() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // トップにいるときの Home はページ遷移せず先頭へスクロール
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, item: NavItem) => {
    if (!isHome || item.href !== "/") return;

    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsOpen(false);
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isHome) return;

    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsOpen(false);
  };

  return (
    <>
      {/* Hamburger button (mobile only) */}
      <button
        className={`${styles.hamburger} ${isOpen ? styles.hamburgerOpen : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="メニュー"
      >
        <span />
        <span />
        <span />
      </button>

      {/* Mobile overlay menu */}
      <div className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ""}`}>
        <nav className={styles.overlayNav}>
          {navItems.map((item) => {
            const isActive = isCurrentNav(item, pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.overlayNavItem} ${isActive ? styles.active : ""}`}
                aria-current={isActive ? "page" : undefined}
                onClick={(e) => handleNavClick(e, item)}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Desktop sidebar menu */}
      <header className={styles.sidebar}>
        <div className={styles.logo}>
          <Link href="/" onClick={handleLogoClick}>
            <img src="/img/logo.png" alt="Gackun. トップへ" />
          </Link>
        </div>
        <nav className={styles.nav}>
          {navItems.map((item) => {
            const isActive = isCurrentNav(item, pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${isActive ? styles.active : ""}`}
                aria-current={isActive ? "page" : undefined}
                onClick={(e) => handleNavClick(e, item)}
              >
                {isActive && (
                  <motion.span
                    className={styles.activeIndicator}
                    layoutId="activeNav"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span className={styles.navLabel}>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className={styles.sns}>
          {snsLinks.map((sns) => (
            <a
              key={sns.label}
              href={sns.href}
              className={styles.snsItem}
              aria-label={`${sns.label} (新しいタブで開く)`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={sns.icon} alt="" />
            </a>
          ))}
        </div>
      </header>
    </>
  );
}
