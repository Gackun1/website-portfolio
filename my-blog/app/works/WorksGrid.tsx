"use client";

import { useState } from "react";
import AnimatedPopup from "../components/motion/AnimatedPopup";
import type { WorkItem } from "../lib/works";
import styles from "./page.module.scss";

type Props = {
  works: WorkItem[];
};

export default function WorksGrid({ works }: Props) {
  const [openPopup, setOpenPopup] = useState<number | null>(null);

  return (
    <>
      <div className={styles.grid}>
        {works.map((work, index) => (
          <article
            key={index}
            className={styles.item}
            onClick={() => setOpenPopup(index)}
          >
            <img src={work.image} alt={work.title} className={styles.image} />
            <div className={styles.overlay} />
            <span className={styles.category}>{work.category}</span>
            <h3 className={styles.title}>{work.title}</h3>
          </article>
        ))}
      </div>

      <AnimatedPopup
        isOpen={openPopup !== null}
        onClose={() => setOpenPopup(null)}
      >
        {openPopup !== null && (
          <img
            src={works[openPopup].fullImage}
            alt={works[openPopup].title}
            style={{ width: "100%", display: "block" }}
          />
        )}
      </AnimatedPopup>
    </>
  );
}
