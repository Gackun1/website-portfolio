"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import styles from "./SideMenu.module.scss";

const navItems = [
  { id: "about", label: "About" },
  { id: "skill", label: "Skill" },
  { id: "works", label: "Works" },
  { id: "blog", label: "Blog" },
  { id: "contact", label: "Contact" },
];

export default function SideMenu() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [activeSection, setActiveSection] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isHome) {
      setActiveSection("");
      return;
    }

    const sectionIds = navItems.map((item) => item.id);
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(id);
            }
          });
        },
        { rootMargin: "-30% 0px -60% 0px" }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [isHome]);

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

  const handleSmoothScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string
  ) => {
    if (!isHome) return; // 下層ページではNext.jsナビゲーションに任せる

    e.preventDefault();
    const targetElement = document.getElementById(sectionId);
    if (targetElement) {
      const rectTop = targetElement.getBoundingClientRect().top;
      const offsetTop = window.pageYOffset;
      const top = rectTop + offsetTop;
      window.scrollTo({ top, behavior: "smooth" });
    }
    setIsOpen(false);
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isHome) return;

    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsOpen(false);
  };

  const getNavHref = (sectionId: string) =>
    isHome ? `#${sectionId}` : `/#${sectionId}`;

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
            const isActive = isHome && activeSection === item.id;
            return (
              <Link
                key={item.id}
                href={getNavHref(item.id)}
                className={`${styles.overlayNavItem} ${isActive ? styles.active : ""}`}
                onClick={(e) => handleSmoothScroll(e, item.id)}
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
            <img src="/img/logo.png" alt="" />
          </Link>
        </div>
        <nav className={styles.nav}>
          {navItems.map((item) => {
            const isActive = isHome && activeSection === item.id;
            return (
              <Link
                key={item.id}
                href={getNavHref(item.id)}
                className={`${styles.navItem} ${isActive ? styles.active : ""}`}
                onClick={(e) => handleSmoothScroll(e, item.id)}
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
          <a href="#" className={styles.snsItem}>
            <img src="/img/i_instagram.png" alt="" />
          </a>
          <a href="#" className={styles.snsItem}>
            <img src="/img/i_twitter.png" alt="" />
          </a>
          <a href="#" className={styles.snsItem}>
            <img src="/img/i_youtube.png" alt="" />
          </a>
        </div>
      </header>
    </>
  );
}
