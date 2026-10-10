"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ParticleLogo, PathLogo, PathLogoPlus } from "../../../components/LogoVisual";
import styles from "./HeroSection.module.scss";

type Segment = { text: string; className?: string };

const HEADING_LINES: Segment[][] = [
  [{ text: "Hello," }],
  [{ text: "I'm " }, { text: "Gac", className: styles.red }, { text: "kun." }],
];
const HEADING_LABEL = HEADING_LINES.map((line) => line.map((s) => s.text).join("")).join(" ");

/**
 * Typewriter — 1文字ずつ打ち込まれる見出し
 * 未入力部分も visibility:hidden で確保しておき、レイアウトシフトとカーソル位置ズレを防ぐ。
 */
function Typewriter() {
  const lineLengths = HEADING_LINES.map((line) => line.reduce((n, s) => n + s.text.length, 0));
  const total = lineLengths.reduce((a, b) => a + b, 0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(total);
      return;
    }
    let n = 0;
    let timer: ReturnType<typeof setTimeout>;
    const step = () => {
      n += 1;
      setCount(n);
      if (n >= total) return;
      // 行末では一拍おいて "考えながら打っている" リズムをつくる
      const lineEnd = n === lineLengths[0];
      timer = setTimeout(step, lineEnd ? 380 : 70 + Math.random() * 70);
    };
    timer = setTimeout(step, 700);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let consumed = 0;
  const done = count >= total;

  return (
    <h1 className={styles.heading} aria-label={HEADING_LABEL}>
      {HEADING_LINES.map((line, li) => {
        const lineStart = consumed;
        consumed += lineLengths[li];
        const typedInLine = Math.min(Math.max(count - lineStart, 0), lineLengths[li]);
        const isCaretLine = done ? li === HEADING_LINES.length - 1 : count >= lineStart && count < consumed;

        let offset = 0;
        return (
          <span key={li} className={styles.line} aria-hidden="true">
            {line.map((seg, si) => {
              const visible = Math.min(Math.max(typedInLine - offset, 0), seg.text.length);
              offset += seg.text.length;
              return (
                <span key={si} className={seg.className}>
                  {seg.text.slice(0, visible)}
                </span>
              );
            })}
            {isCaretLine && <span className={`${styles.caret} ${done ? styles.caretBlink : ""}`} />}
            <span className={styles.ghost}>
              {line
                .map((s) => s.text)
                .join("")
                .slice(typedInLine)}
            </span>
          </span>
        );
      })}
    </h1>
  );
}

const hudTransition = (delay: number) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as const },
});

/** MV のロゴビジュアル (components/LogoVisual) */
const VISUALS = {
  particle: ParticleLogo, // WebGL パーティクル版
  pathPlus: PathLogoPlus, // パス描画のブラッシュアップ版
  path: PathLogo, // 初期のパス描画版
} as const;

export type HeroVisual = keyof typeof VISUALS;

interface Props {
  /** ロゴビジュアルの種類 */
  visual?: HeroVisual;
  /** 背景の塵パーティクルを表示するか */
  dust?: boolean;
}

export default function HeroSection({ visual = "particle", dust = true }: Props) {
  const Visual = VISUALS[visual];

  return (
    <section id="top" className={styles.section}>
      <Visual dust={dust} />
      <div className={styles.vignette} aria-hidden="true" />

      <motion.div className={styles.hudTop} {...hudTransition(2.6)}>
        <p className={styles.hudLabel}>
          <span className={styles.comment}>{"// "}</span>
          Glad you stopped by.
        </p>
      </motion.div>

      <Typewriter />

      <motion.a href="#about" className={styles.scroll} aria-label="Aboutへスクロール" {...hudTransition(3)}>
        <span className={styles.scrollLabel}>scroll</span>
        <span className={styles.scrollLine} />
      </motion.a>
    </section>
  );
}
