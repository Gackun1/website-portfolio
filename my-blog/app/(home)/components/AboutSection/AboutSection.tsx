"use client";

import ScrollReveal from "../../../components/motion/ScrollReveal";
import ScrubText, { type Phrase } from "../../../components/motion/ScrubText";
import SectionHeading from "../../../components/SectionHeading/SectionHeading";
import styles from "./AboutSection.module.scss";

/**
 * About — "何者で、何を頼めて、どう仕事をするか" を伝えるセクション
 *
 * 1. Statement : スクロールに合わせて点灯する大きなリード文 (考え方)
 * 2. Profile   : 短い自己紹介と基本情報 (何者か)
 * 3. Services  : 依頼できること 3 つ (何を頼めるか)
 */

// 1行 = 1つの意味のまとまり。文節単位で区切り、狭い画面でも語の途中では折り返さない
const statement: Phrase[][] = [
  [{ text: "見た目の" }, { text: "美しさだけでなく、" }],
  [{ text: "使いやすさ、" }, { text: "速さ、" }, { text: "見つけてもらえること。" }],
  [{ text: "そのすべてを" }, { text: "設計して、" }],
  [{ text: "“伝わる”", accent: true }, { text: "ウェブを" }, { text: "つくります。" }],
];

const facts = [
  { label: "Based in", value: "Tokyo, Japan" },
  { label: "Work style", value: "Freelance" },
  { label: "Background", value: "HAL" },
];

const services = [
  {
    title: "Web Design",
    body: "目的とターゲットの整理から、情報設計・UI デザインまで。Figma で意図の伝わる画面を組み立てます。",
  },
  {
    title: "Front-end & WordPress",
    body: "デザインを忠実に、かつ保守しやすく実装。WordPress のオリジナルテーマ開発を得意としています。",
  },
  {
    title: "SEO & Motion",
    body: "検索エンジンに正しく伝わる構造と表示速度。そして、触れて心地よいアニメーションで体験を一段引き上げます。",
  },
];

export default function AboutSection() {
  return (
    <section id="about" className={styles.section}>
      <SectionHeading name="about" index="01" label="Who I am" />

      <ScrubText
        lines={statement}
        className={styles.statement}
        lineClassName={styles.statementLine}
        phraseClassName={styles.phrase}
        accentClassName={styles.accent}
      />

      <div className={styles.grid}>
        <ScrollReveal className={styles.profile}>
          <p className={styles.bio}>
            フロントエンド開発者・デザイナーのGackunです。HALを卒業後、東京を拠点にフリーランスとして活動しています。デザインからコーディングまでを一人で一貫して担当できるので、意図がぶれずに形になります。
          </p>
          <dl className={styles.facts}>
            {facts.map((f) => (
              <div key={f.label} className={styles.fact}>
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        </ScrollReveal>

        <ol className={styles.services}>
          {services.map((s, i) => (
            <li key={s.title}>
              <ScrollReveal delay={i * 0.08}>
                <div className={styles.service}>
                  <span className={styles.serviceNum}>{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className={styles.serviceTitle}>{s.title}</h3>
                    <p className={styles.serviceBody}>{s.body}</p>
                  </div>
                </div>
              </ScrollReveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
