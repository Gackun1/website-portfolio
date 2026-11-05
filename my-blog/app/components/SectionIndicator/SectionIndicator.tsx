"use client";

import { useEffect, useState } from "react";
import { homeSections, scrollToId } from "../../lib/nav";
import styles from "./SectionIndicator.module.scss";

/** トップページ右側のスクロール位置インジケーター (セクションごとのドットを縦線でつなぐ) */
export default function SectionIndicator() {
  const [active, setActive] = useState(homeSections[0].id);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    homeSections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) setActive(id);
          });
        },
        { rootMargin: "-30% 0px -60% 0px" }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <nav className={styles.indicator} aria-label="ページ内のセクション">
      <ol className={styles.list}>
        {homeSections.map((s) => {
          const isActive = s.id === active;
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className={`${styles.dot} ${isActive ? styles.active : ""}`}
                aria-label={s.label}
                title={s.label}
                aria-current={isActive ? "location" : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToId(s.id);
                }}
              />
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
