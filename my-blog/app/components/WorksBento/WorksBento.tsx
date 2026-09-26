"use client";

import { useCallback, useState } from "react";
import StaggerContainer from "../motion/StaggerContainer";
import StaggerItem from "../motion/StaggerItem";
import AnimatedPopup from "../motion/AnimatedPopup";
import type { WorkItem } from "../../lib/works";
import styles from "./WorksBento.module.scss";

type Props = {
  works: WorkItem[];
};

/**
 * Bento グリッドの穴埋め
 * 先頭を大きく (3列: 2x2 / 2列: 横2) 見せ、最後の要素の横幅で余りセルを埋める。
 */
function spanClasses(index: number, total: number) {
  const classes: string[] = [];
  if (index === 0) classes.push(styles.feature);
  if (total > 1 && index === total - 1) {
    const holes3 = (3 - (total % 3)) % 3; // 3列時: 先頭の 2x2 で +3 セル
    if (holes3 === 1) classes.push(styles.wide2Desktop);
    if (holes3 === 2) classes.push(styles.wide3Desktop);
    if (total % 2 === 0) classes.push(styles.wide2Tablet); // 2列時: 先頭が横2
  }
  return classes.join(" ");
}

/** 制作実績の Bento グリッド + 全体画像のポップアップ (トップ / 一覧ページ共通) */
export default function WorksBento({ works }: Props) {
  const [openPopup, setOpenPopup] = useState<number | null>(null);
  const close = useCallback(() => setOpenPopup(null), []);
  const current = openPopup !== null ? works[openPopup] : null;

  return (
    <>
      <div className={styles.gridWrap}>
        <StaggerContainer className={styles.grid} staggerDelay={0.1}>
          {works.map((work, index) => (
            <StaggerItem key={work.slug} className={`${styles.cell} ${spanClasses(index, works.length)}`}>
              <article
                className={styles.item}
                role="button"
                tabIndex={0}
                aria-label={`${work.title} の画像を拡大表示`}
                onClick={() => setOpenPopup(index)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setOpenPopup(index);
                  }
                }}
              >
                <img src={work.image} alt="" className={styles.image} loading="lazy" />
                <div className={styles.overlay} />
                <span className={styles.num}>{String(index + 1).padStart(2, "0")}</span>
                <div className={styles.info}>
                  <div>
                    <span className={styles.category}>{work.category}</span>
                    <h3 className={styles.title}>{work.title}</h3>
                  </div>
                  <span className={styles.view}>
                    View <span aria-hidden="true">↗</span>
                  </span>
                </div>
              </article>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>

      <AnimatedPopup isOpen={current !== null} onClose={close} title={current?.title} meta={current?.category}>
        {current && <img src={current.fullImage} alt={current.title} style={{ width: "100%", display: "block" }} />}
      </AnimatedPopup>
    </>
  );
}
