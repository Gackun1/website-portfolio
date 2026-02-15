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
  };

  return (
    <header className={styles.cSideMenu}>
      <div className={styles.cSideMenuImg}>
        <a href="#top" onClick={(e) => handleSmoothScroll(e, "#top")}>
          <img src="/img/logo.png" alt="" />
        </a>
      </div>
      <nav className={styles.cSideMenuNav}>
        {navItems.map((item) => {
          const sectionId = item.href.replace("#", "");
          const isActive = activeSection === sectionId;
          return (
            <a
              key={item.href}
              href={item.href}
              className={`${styles.cSideMenuNavItem} ${isActive ? styles.active : ""}`}
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
      <div className={styles.cSideMenuSns}>
        <a href="#" className={styles.cSideMenuSnsItem}>
          <img src="/img/i_instagram.png" alt="" />
        </a>
        <a href="#" className={styles.cSideMenuSnsItem}>
          <img src="/img/i_twitter.png" alt="" />
        </a>
        <a href="#" className={styles.cSideMenuSnsItem}>
          <img src="/img/i_youtube.png" alt="" />
        </a>
      </div>
    </header>
  );
}
