"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import styles from "./SideMenu.module.scss";

const navItems = [
  { href: "#about", label: "About" },
  { href: "#skill", label: "Skill" },
  { href: "#works", label: "Works" },
  { href: "#blog", label: "Blog" },
  { href: "#contact", label: "Contact" },
];

export default function SideMenu() {
  const [activeSection, setActiveSection] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const sectionIds = ["about", "skill", "works", "blog", "contact"];
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
  }, []);

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
    href: string
  ) => {
    e.preventDefault();
    const targetElement = document.querySelector(href);
    if (targetElement) {
      const rectTop = targetElement.getBoundingClientRect().top;
      const offsetTop = window.pageYOffset;
      const top = rectTop + offsetTop;
      window.scrollTo({
        top,
        behavior: "smooth",
      });
    }
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
            const sectionId = item.href.replace("#", "");
            const isActive = activeSection === sectionId;
            return (
              <a
                key={item.href}
                href={item.href}
                className={`${styles.overlayNavItem} ${isActive ? styles.active : ""}`}
                onClick={(e) => handleSmoothScroll(e, item.href)}
              >
                {item.label}
              </a>
            );
          })}
        </nav>
      </div>

      {/* Desktop sidebar menu */}
      <header className={styles.sidebar}>
        <div className={styles.logo}>
          <a href="#top" onClick={(e) => handleSmoothScroll(e, "#top")}>
            <img src="/img/logo.png" alt="" />
          </a>
        </div>
        <nav className={styles.nav}>
          {navItems.map((item) => {
            const sectionId = item.href.replace("#", "");
            const isActive = activeSection === sectionId;
            return (
              <a
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${isActive ? styles.active : ""}`}
                onClick={(e) => handleSmoothScroll(e, item.href)}
              >
                {isActive && (
                  <motion.span
                    className={styles.activeIndicator}
                    layoutId="activeNav"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span className={styles.navLabel}>{item.label}</span>
              </a>
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
