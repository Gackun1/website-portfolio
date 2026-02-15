"use client";

import { useState } from "react";
import ScrollReveal from "../../../components/motion/ScrollReveal";
import StaggerContainer from "../../../components/motion/StaggerContainer";
import StaggerItem from "../../../components/motion/StaggerItem";
import AnimatedPopup from "../../../components/motion/AnimatedPopup";
import SectionHeading from "../../../components/SectionHeading/SectionHeading";
import TerminalButton from "../../../components/TerminalButton/TerminalButton";
import styles from "./WorksSection.module.scss";

type WorkItem = {
  image: string;
  category: string;
  title: string;
  fullImage: string;
};

const works: WorkItem[] = [
  { image: "/img/works01.jpg", category: "web site", title: "Labe", fullImage: "/img/works01_full.png" },
  { image: "/img/works02.jpg", category: "web site", title: "HAL幼稚園", fullImage: "/img/works02_full.png" },
  { image: "/img/works03.jpg", category: "web site", title: "越後妻有", fullImage: "/img/works03_full.png" },
  { image: "/img/works04.png", category: "web site", title: "Studio Zero", fullImage: "/img/works04_full.png" },
  { image: "/img/works05.png", category: "web app", title: "Group Work", fullImage: "/img/works05_full.png" },
];

export default function WorksSection() {
  const [openPopup, setOpenPopup] = useState<number | null>(null);

  return (
    <>
      <section id="works" className={styles.cSection}>
        <ScrollReveal>
          <SectionHeading name="works" args="'select'" />
          <div className={styles.cSectionDescription}>
            私の制作実績です。
            <br />
            全て見るには<a href="#">一覧ページ</a>にアクセスしてください！
          </div>
        </ScrollReveal>
      </section>

      <StaggerContainer className={styles.cWorks}>
        {works.map((work, index) => (
          <StaggerItem key={index}>
            <article
              className={styles.cWorksItem}
              onClick={() => setOpenPopup(index)}
            >
              <img src={work.image} alt={work.title} className={styles.cWorksImg} />
              <div className={styles.cWorksOverlay} />
              <span className={styles.cWorksCat}>{work.category}</span>
              <h3 className={styles.cWorksHeading}>{work.title}</h3>
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

      <ScrollReveal>
        <TerminalButton label="もっと見る" />
      </ScrollReveal>
    </>
  );
}
