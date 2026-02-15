"use client";

import styles from "./SideMenu.module.scss";

export default function SideMenu() {
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
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
        <a href="#about" className={styles.cSideMenuNavItem} onClick={(e) => handleSmoothScroll(e, "#about")}>
          About
        </a>
        <a href="#skill" className={styles.cSideMenuNavItem} onClick={(e) => handleSmoothScroll(e, "#skill")}>
          Skill
        </a>
        <a href="#works" className={styles.cSideMenuNavItem} onClick={(e) => handleSmoothScroll(e, "#works")}>
          Works
        </a>
        <a href="#blog" className={styles.cSideMenuNavItem} onClick={(e) => handleSmoothScroll(e, "#blog")}>
          Blog
        </a>
        <a href="#contact" className={styles.cSideMenuNavItem} onClick={(e) => handleSmoothScroll(e, "#contact")}>
          Contact
        </a>
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