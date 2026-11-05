import FooterWordmark from "./FooterWordmark";
import FooterNav from "./FooterNav";
import styles from "./Footer.module.scss";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <p className={styles.tagline}>
          <span className={styles.comment}>{"// "}</span>
          Thanks for scrolling.
        </p>
        <FooterNav />
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
