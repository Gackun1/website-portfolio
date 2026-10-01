import Link from "next/link";
import FooterWordmark from "./FooterWordmark";
import styles from "./Footer.module.scss";

const links = [
  { id: "about", label: "About" },
  { id: "skill", label: "Skill" },
  { id: "works", label: "Works" },
  { id: "blog", label: "Blog" },
  { id: "contact", label: "Contact" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <p className={styles.tagline}>
          <span className={styles.comment}>{"// "}</span>
          Thanks for scrolling.
        </p>
        <nav className={styles.nav} aria-label="フッターナビゲーション">
          {links.map((l) => (
            <Link key={l.id} href={`/#${l.id}`} className={styles.link}>
              {l.label}
            </Link>
          ))}
        </nav>
      </div>

      <FooterWordmark />

      <div className={styles.bottom}>
        <small>&copy; 2022–{year} Gackun.</small>
      </div>

      <a href="#" className={styles.toTop}>
        Back to top <span aria-hidden="true">↑</span>
      </a>
    </footer>
  );
}
