import Link from "next/link";
import styles from "./Breadcrumb.module.scss";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="パンくずリスト" className={styles.nav}>
      <ol className={styles.list}>
        <li className={styles.item}>
          <Link href="/" className={styles.link}>
            Home
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={i} className={styles.item}>
            <span className={styles.separator}>/</span>
            {item.href ? (
              <Link href={item.href} className={styles.link}>
                {item.label}
              </Link>
            ) : (
              <span className={styles.current}>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
