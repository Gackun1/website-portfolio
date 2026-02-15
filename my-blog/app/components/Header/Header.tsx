import styles from "./Header.module.scss";

export default function Header() {
  return (
    <header className={styles.header}>
      <a href="/"></a>
      <ul>
        <li>
          <a href="">About</a>
        </li>
        <li>
          <a href="">Skill</a>
        </li>
        <li>
          <a href="">Works</a>
        </li>
        <li>
          <a href="">Blog</a>
        </li>
        <li>
          <a href="">Contact</a>
        </li>
      </ul>
    </header>
  );
}
