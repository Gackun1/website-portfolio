"use client";

import Link from "next/link";
import ScrollReveal from "../../../components/motion/ScrollReveal";
import SectionHeading from "../../../components/SectionHeading/SectionHeading";
import TerminalButton from "../../../components/TerminalButton/TerminalButton";
import WorksBento from "../../../components/WorksBento/WorksBento";
import type { WorkItem } from "../../../lib/works";
import styles from "./WorksSection.module.scss";

type Props = {
  works: WorkItem[];
};

export default function WorksSection({ works }: Props) {
  return (
    <>
      <section id="works" className={styles.section}>
        <SectionHeading name="works" args="'select'" index="03" label="Selected works" />
        <ScrollReveal>
          <p className={styles.description}>
            これまでに手がけたサイト・デザインの一部です。
            <br />
            すべての実績は<Link href="/works">一覧ページ</Link>からご覧いただけます。
          </p>
        </ScrollReveal>
      </section>

      <WorksBento works={works} />

      <ScrollReveal className={styles.moreButton}>
        <TerminalButton label="すべての実績を見る" href="/works" />
      </ScrollReveal>
    </>
  );
}
