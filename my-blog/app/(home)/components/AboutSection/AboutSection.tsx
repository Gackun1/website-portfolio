"use client";

import { useEffect, useState } from "react";
import ScrollReveal from "../../../components/motion/ScrollReveal";
import ScrubText, { type Phrase } from "../../../components/motion/ScrubText";
import SectionHeading from "../../../components/SectionHeading/SectionHeading";
import AboutDiagram, { DIAGRAM_COLORS } from "./AboutDiagram";
import styles from "./AboutSection.module.scss";

/**
 * About — "何者で、何を頼めて、どう仕事をするか" を伝えるセクション
 *
 * 1. Statement : スクロールに合わせて点灯する大きなリード文 (考え方)
 * 2. Diagram   : ホバー中の領域を図で見せる (AboutDiagram)
 * 3. Services  : 依頼できること 3 つ (何を頼めるか)
 */

// 1行 = 1つの意味のまとまり。文節単位で区切り、狭い画面でも語の途中では折り返さない
const statement: Phrase[][] = [
  [{ text: "見た目の" }, { text: "美しさだけでなく、" }],
  [{ text: "使いやすさ、" }, { text: "速さ、" }, { text: "見つけてもらえること。" }],
  [{ text: "そのすべてを" }, { text: "設計して、" }],
  [{ text: "“伝わる”", accent: true }, { text: "ウェブを" }, { text: "つくります。" }],
];

const services = [
  {
    title: "Frontend & CMS",
    body: [
      "デザインを忠実に、保守しやすいコードで実装。",
      "WordPress や Movable Type などの CMS 構築、オリジナルテーマの開発まで一貫して対応します。",
    ],
  },
  {
    title: "Design & Motion",
    body: [
      "目的とターゲットの整理から、情報設計・UI デザインまで。",
      "触れて心地よいアニメーションで、体験をもう一段引き上げます。",
    ],
  },
  {
    title: "SEO & Performance",
    body: [
      "検索エンジンに正しく伝わる構造と、待たせない表示速度。",
      "Core Web Vitals を指標に、見つけてもらえて離脱されないサイトに仕上げます。",
    ],
  },
];

export default function AboutSection() {
  const [active, setActive] = useState(0);

  // ホバーできない端末では図を自動で切り替える
  useEffect(() => {
    if (!window.matchMedia("(hover: none)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setActive((i) => (i + 1) % services.length), 4500);
    return () => clearInterval(id);
  }, []);

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
        <ScrollReveal className={styles.diagram}>
          <AboutDiagram active={active} />
        </ScrollReveal>

        <ol className={styles.services}>
          {services.map((s, i) => (
            <li key={s.title}>
              <ScrollReveal delay={i * 0.08}>
                <div
                  className={`${styles.service} ${i === active ? styles.active : ""}`}
                  style={{ ["--accent" as string]: DIAGRAM_COLORS[i] }}
                  tabIndex={0}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                >
                  <span className={styles.serviceNum}>{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className={styles.serviceTitle}>{s.title}</h3>
                    <p className={styles.serviceBody}>
                      {s.body.map((line, li) => (
                        <span key={li}>
                          {li > 0 && <br className={styles.br} />}
                          {line}
                        </span>
                      ))}
                    </p>
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
