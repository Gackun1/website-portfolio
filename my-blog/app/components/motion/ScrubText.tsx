"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useTransform, type MotionValue } from "framer-motion";

/**
 * ScrubText — スクロール量に合わせて文字が順に点灯する文章
 * 読む速度とスクロールが同期し、ステートメントを "読ませる" ための演出。
 *
 * ■ 改行
 *   lines = 行の配列、各行 = 文節 (phrase) の配列。
 *   行は block、文節は折り返さない inline-block にしているので、
 *   広い画面では指定どおりの行で、狭い画面でも文節の切れ目でしか改行しない。
 *
 * ■ 進捗
 *   要素の上端が画面の START 位置に来た時点で 0、下端が END 位置に来た時点で 1。
 *   getBoundingClientRect から毎フレーム直接算出する (レイアウト変化にも追従)。
 */

export type Phrase = { text: string; accent?: boolean };

interface Props {
  lines: Phrase[][];
  className?: string;
  lineClassName?: string;
  phraseClassName?: string;
  accentClassName?: string;
}

const START = 0.85; // 上端がビューポートの 85% 位置 → 0
const END = 0.4; // 下端がビューポートの 40% 位置 → 1
const SPREAD = 4; // 1文字が点灯しきるまでにかかる文字数ぶんの幅

function Char({ char, progress, range }: { char: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return <motion.span style={{ opacity }}>{char}</motion.span>;
}

export default function ScrubText({ lines, className, lineClassName, phraseClassName, accentClassName }: Props) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const progress = useMotionValue(0);

  useEffect(() => {
    if (reduce) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const startY = vh * START; // rect.top がここで 0
      const endY = vh * END; // rect.bottom がここで 1
      const total = startY - endY + rect.height;
      const p = (startY - rect.top) / total;
      progress.set(Math.min(Math.max(p, 0), 1));
    };
    const request = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
    };
  }, [progress, reduce]);

  const label = lines.map((l) => l.map((p) => p.text).join("")).join("");
  const total = label.length;
  let index = 0;

  return (
    <p ref={ref} className={className} aria-label={label}>
      {lines.map((line, li) => (
        <span key={li} className={lineClassName} aria-hidden="true">
          {line.map((phrase, pi) => (
            <span
              key={pi}
              className={[phraseClassName, phrase.accent ? accentClassName : ""].filter(Boolean).join(" ")}
            >
              {reduce
                ? phrase.text
                : phrase.text.split("").map((c) => {
                    const i = index++;
                    const start = (i / total) * (1 - SPREAD / total);
                    return <Char key={i} char={c} progress={progress} range={[start, start + SPREAD / total]} />;
                  })}
            </span>
          ))}
        </span>
      ))}
    </p>
  );
}
