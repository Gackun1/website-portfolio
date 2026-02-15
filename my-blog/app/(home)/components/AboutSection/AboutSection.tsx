"use client";

import ScrollReveal from "../../../components/motion/ScrollReveal";
import SectionHeading from "../../../components/SectionHeading/SectionHeading";
import styles from "./AboutSection.module.scss";

export default function AboutSection() {
  return (
    <section id="about" className={styles.section}>
      <ScrollReveal>
        <SectionHeading name="about" />
        <div className={styles.description}>
          私はウェブのフロントエンド開発者・デザイナーです。
          <br />
          HALを卒業後東京を拠点にフリーランス活動をしています。
          <br />
          主な活動内容はウェブサイトのデザインとコーディングで、特にWordPressのテーマ開発とSEOに特化したサイト制作が強みです。
          <br />
          また、アニメーションなどを駆使したクリエイティブな開発も行っています。
        </div>
      </ScrollReveal>
    </section>
  );
}
