"use client";

import { useEffect, useRef, useState } from "react";
import { LOGO_PATHS } from "../../lib/logoPaths";
import DustField from "./DustField";
import styles from "./LogoVisual.module.scss";

/**
 * PathLogo — 初期版の MV (パスのストローク描画 → 黒塗り + グロー)
 *
 * アニメーション・配置とも当時の AnimatedSVG のまま。背景の塵 (DustField) だけ追加。
 *
 * 使い方: position: relative な親の中に置くだけ
 *   <PathLogo />            背景の塵あり (デフォルト)
 *   <PathLogo dust={false} /> 背景の塵なし
 */

interface Props {
  /** 背景の塵パーティクルを表示する */
  dust?: boolean;
}

export default function PathLogo({ dust = true }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const paths = svg.querySelectorAll("path");
    const timers: ReturnType<typeof setTimeout>[] = [];

    paths.forEach((path, index) => {
      const length = path.getTotalLength();
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length}`;
      path.style.fill = "transparent";
      path.style.stroke = "#66d9ef";
      path.style.strokeWidth = "1";
      path.style.strokeMiterlimit = "10";

      timers.push(
        setTimeout(() => {
          path.style.transition = "stroke-dashoffset 2s ease-in-out, fill 1.5s ease";
          path.style.strokeDashoffset = "0";
        }, index * 200),
      );
    });

    timers.push(
      setTimeout(() => {
        paths.forEach((path) => {
          path.style.fill = "#000";
        });
        setIsAnimationComplete(true);
      }, 2000 + paths.length * 200),
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  // マウスと逆方向に即時追従
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const svg = svgRef.current;
      if (!svg) return;
      const posX = -(e.clientX / window.innerWidth - 0.5) * 20;
      const posY = -(e.clientY / window.innerHeight - 0.5) * 20;
      svg.style.transition = "none";
      svg.style.transform = `translate(${posX}px, ${posY}px)`;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className={styles.root} aria-hidden="true">
      {dust && <DustField />}
      <div className={styles.pathContainer}>
        <svg
          ref={svgRef}
          className={`${styles.pathSvg} ${isAnimationComplete ? styles.complete : ""}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 499 499"
        >
          {LOGO_PATHS.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </svg>
      </div>
    </div>
  );
}
