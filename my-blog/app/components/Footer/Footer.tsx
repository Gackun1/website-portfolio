import styles from "./Footer.module.scss";

export default function Footer() {
  return (
    <footer className={styles.cFooter}>
      <small className={styles.cFooterCopy}>©2022 Gackun.</small>
    </footer>
  );
}
