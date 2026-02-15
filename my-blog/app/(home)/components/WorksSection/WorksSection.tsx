"use client";

import { useState } from "react";
import Link from "next/link";
import ScrollReveal from "../../../components/motion/ScrollReveal";
import StaggerContainer from "../../../components/motion/StaggerContainer";
import StaggerItem from "../../../components/motion/StaggerItem";
import AnimatedPopup from "../../../components/motion/AnimatedPopup";
import SectionHeading from "../../../components/SectionHeading/SectionHeading";
import TerminalButton from "../../../components/TerminalButton/TerminalButton";
import type { WorkItem } from "../../../lib/works";
import styles from "./WorksSection.module.scss";

type Props = {
  works: WorkItem[];
};

export default function WorksSection({ works }: Props) {
  const [openPopup, setOpenPopup] = useState<number | null>(null);

  return (
    <>
      <section id="works" className={styles.section}>
        <ScrollReveal>
          <SectionHeading name="works" args="'select'" />
          <div className={styles.description}>
            私の制作実績です。
            <br />
            全て見るには<Link href="/works">一覧ページ</Link>にアクセスしてください！
          </div>
        </ScrollReveal>
      </section>

      <StaggerContainer className={styles.grid}>
        {works.map((work, index) => (
          <StaggerItem key={index}>
            <article
              className={styles.item}
              onClick={() => setOpenPopup(index)}
            >
              <img src={work.image} alt={work.title} className={styles.image} />
              <div className={styles.overlay} />
              <span className={styles.category}>{work.category}</span>
              <h3 className={styles.title}>{work.title}</h3>
            </article>
          </StaggerItem>
        ))}
      </StaggerContainer>

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

      <ScrollReveal className={styles.moreButton}>
        <TerminalButton label="もっと見る" href="/works" />
      </ScrollReveal>
    </>
  );
}
