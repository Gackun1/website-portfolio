"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import styles from "./Footer.module.scss";

/**
 * FooterWordmark — 画面幅いっぱいの "Gackun." がアウトラインで描かれていく
 *
 * SVG <text> の stroke-dashoffset をアニメーションさせ、文字ごとに時間差で輪郭を描画する。
 * フォントに依らず横幅いっぱいに収まるよう、getBBox で viewBox を実寸に合わせる。
 */

const SEGMENTS = [
  { text: "Gac", accent: true },
  { text: "kun.", accent: false },
];
const FONT_SIZE = 200;

export default function FooterWordmark() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<SVGTextElement>(null);
  const [viewBox, setViewBox] = useState("0 0 800 200");
  const inView = useInView(wrapRef, { once: true, margin: "0px 0px -15% 0px" });
  const reduce = useReducedMotion();

  const measure = useCallback(() => {
    const box = textRef.current?.getBBox();
    if (box && box.width) setViewBox(`${box.x} ${box.y} ${box.width} ${box.height}`);
  }, []);

  useLayoutEffect(measure, [measure]);

  // Web フォントの読み込み完了で字幅が変わるので測り直す
  useEffect(() => {
    document.fonts?.ready.then(measure);
  }, [measure]);

  let charIndex = 0;

  return (
    <div ref={wrapRef} className={styles.wordmark} aria-hidden="true">
      <svg viewBox={viewBox} preserveAspectRatio="xMinYMid meet" className={styles.wordmarkSvg}>
        <text
          ref={textRef}
          x="0"
          y="0"
          fontSize={FONT_SIZE}
          className={`${styles.wordmarkText} ${inView || reduce ? styles.drawn : ""}`}
        >
          {SEGMENTS.map((seg) =>
            seg.text.split("").map((ch) => {
              const i = charIndex++;
              return (
                <tspan
                  key={i}
                  className={seg.accent ? styles.accent : undefined}
                  // stroke-dashoffset / fill それぞれの遅延 (fill は描き終わってから)
                  style={{ transitionDelay: `${i * 0.09}s, ${i * 0.09 + 2.4}s` }}
                >
                  {ch}
                </tspan>
              );
            }),
          )}
        </text>
      </svg>
    </div>
  );
}
