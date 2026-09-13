"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Transition,
} from "framer-motion";
import { LOGO_PATHS, LOGO_RING } from "../../lib/logoPaths";
import DustField from "./DustField";
import styles from "./LogoVisual.module.scss";

/**
 * PathLogoPlus — PathLogo (パス描画 → 黒塗り + グロー) のブラッシュアップ版
 *
 * ■ 旧版からの変更点
 *   1. 作図線      : 正円・十字の補助線が先に引かれ、"設計してから描く" 工程を見せる
 *   2. 描画        : 一定速度 → 加減速のある筆致。線の先端に光点 (comet) が走る
 *   3. 完成        : 黒塗りに一瞬のグリッチ (RGB ずれ) を挟み、塗りは青みのグラデーションへ
 *   4. 待機        : 光沢が周期的に表面を走り、回路のように光が輪郭を巡る
 *   5. ポインター  : 即時追従の平行移動 → バネで遅れて追う 3D チルト
 *   6. スクロール  : 奥へ沈みながらフェードアウト
 *
 * 使い方: position: relative な親の中に置くだけ
 *   <PathLogoPlus />              背景の塵あり (デフォルト)
 *   <PathLogoPlus dust={false} /> 背景の塵なし
 */

interface Props {
  /** 背景の塵パーティクルを表示する */
  dust?: boolean;
}

// ロゴは viewBox 中央からずれているので、外周リングの中心を基準に表示領域を取る
const VIEW = 500;
const VIEWBOX = `${LOGO_RING.cx - VIEW / 2} ${LOGO_RING.cy - VIEW / 2} ${VIEW} ${VIEW}`;
const GUIDE_R = LOGO_RING.r + 16;

const DRAW = 2.2; // 1本あたりの描画時間 (s)
const STAGGER = 0.32;
const START = 0.6; // 作図線のあと
const DONE = START + STAGGER * (LOGO_PATHS.length - 1) + DRAW;
const drawEase = [0.65, 0, 0.35, 1] as const;

export default function PathLogoPlus({ dust = true }: Props) {
  const reduce = useReducedMotion();
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (reduce) {
      setDone(true);
      return;
    }
    const t = setTimeout(() => setDone(true), DONE * 1000);
    return () => clearTimeout(t);
  }, [reduce]);

  // ---- ポインターで 3D チルト (バネで遅延追従) ----
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateY = useSpring(useTransform(px, [-1, 1], [-12, 12]), { stiffness: 60, damping: 18 });
  const rotateX = useSpring(useTransform(py, [-1, 1], [9, -9]), { stiffness: 60, damping: 18 });
  const shiftX = useSpring(useTransform(px, [-1, 1], [-14, 14]), { stiffness: 60, damping: 18 });

  useEffect(() => {
    if (reduce) return;
    const onMove = (e: PointerEvent) => {
      px.set((e.clientX / window.innerWidth) * 2 - 1);
      py.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [px, py, reduce]);

  // ---- スクロールで奥へ沈む ----
  const { scrollY } = useScroll();
  const sinkScale = useTransform(scrollY, [0, 700], [1, 0.82]);
  const sinkOpacity = useTransform(scrollY, [0, 600], [1, 0]);

  const draw = (i: number): Transition => ({
    duration: reduce ? 0 : DRAW,
    ease: drawEase,
    delay: reduce ? 0 : START + i * STAGGER,
  });

  return (
    <div className={styles.root} aria-hidden="true">
      {dust && <DustField />}
      <motion.div className={styles.plusContainer} style={{ scale: sinkScale, opacity: sinkOpacity }}>
        <motion.div className={styles.plusTilt} style={{ rotateX, rotateY, x: shiftX }}>
          <svg className={styles.plusSvg} viewBox={VIEWBOX} fill="none">
            <defs>
              <filter id="bl-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="bl-spark" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <linearGradient id="bl-fill" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#0b0f12" />
                <stop offset="60%" stopColor="#0e1418" />
                <stop offset="100%" stopColor="#163038" />
              </linearGradient>
              <linearGradient id="bl-shine" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#66d9ef" stopOpacity="0" />
                <stop offset="50%" stopColor="#bff4ff" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#66d9ef" stopOpacity="0" />
              </linearGradient>
              <clipPath id="bl-clip">
                {LOGO_PATHS.map((d, i) => (
                  <path key={i} d={d} />
                ))}
              </clipPath>
            </defs>

            {/* 1. 作図線: 正円 + 十字 */}
            <g stroke="#66d9ef" strokeOpacity="0.16" strokeWidth="0.6">
              <motion.circle
                cx={LOGO_RING.cx}
                cy={LOGO_RING.cy}
                r={GUIDE_R}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: reduce ? 0 : 1.6, ease: drawEase }}
              />
              <motion.path
                d={`M${LOGO_RING.cx - GUIDE_R - 24} ${LOGO_RING.cy} H${LOGO_RING.cx + GUIDE_R + 24} M${LOGO_RING.cx} ${LOGO_RING.cy - GUIDE_R - 24} V${LOGO_RING.cy + GUIDE_R + 24}`}
                strokeDasharray="2 6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: reduce ? 0 : 1.2, delay: reduce ? 0 : 0.3 }}
              />
            </g>

            {/* 3. 完成時のグリッチ (RGB ずれ) */}
            {done && !reduce && (
              <g>
                {[
                  { c: "#f92672", x: -3, y: 1 },
                  { c: "#a6e22e", x: 3, y: -1 },
                ].map((g) => (
                  <g key={g.c} transform={`translate(${g.x} ${g.y})`}>
                    <motion.g
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 0.8, 0, 0.5, 0] }}
                      transition={{ duration: 0.45, times: [0, 0.2, 0.45, 0.7, 1] }}
                    >
                      {LOGO_PATHS.map((d, i) => (
                        <path key={i} d={d} stroke={g.c} strokeWidth="1.2" />
                      ))}
                    </motion.g>
                  </g>
                ))}
              </g>
            )}

            {/* 3. 塗り */}
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: done ? 1 : 0 }}
              transition={{ duration: reduce ? 0 : 1.2, ease: "easeOut" }}
            >
              {LOGO_PATHS.map((d, i) => (
                <path key={i} d={d} fill="url(#bl-fill)" />
              ))}
            </motion.g>

            {/* 2. 輪郭の描画 */}
            <g filter="url(#bl-glow)">
              {LOGO_PATHS.map((d, i) => (
                <motion.path
                  key={i}
                  d={d}
                  stroke="#66d9ef"
                  strokeWidth="1.3"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ pathLength: draw(i), opacity: { duration: 0.2, delay: draw(i).delay } }}
                />
              ))}
            </g>

            {/* 2. 描画中の線の先端を走る光点 */}
            {!reduce && (
              <g filter="url(#bl-spark)">
                {LOGO_PATHS.map((d, i) => (
                  <motion.path
                    key={i}
                    d={d}
                    stroke="#ffffff"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    initial={{ pathLength: 0.018, pathOffset: 0, opacity: 0 }}
                    animate={{ pathOffset: 0.982, opacity: [0, 1, 1, 0] }}
                    transition={{
                      pathOffset: draw(i),
                      opacity: { ...draw(i), ease: "linear", times: [0, 0.05, 0.9, 1] },
                    }}
                  />
                ))}
              </g>
            )}

            {/* 4. 待機: 光沢スイープ */}
            {done && !reduce && (
              <g clipPath="url(#bl-clip)">
                <g transform="skewX(-18)">
                  <motion.rect
                  y="-50"
                  width="140"
                  height="600"
                  fill="url(#bl-shine)"
                  initial={{ x: -260 }}
                  animate={{ x: 620 }}
                    transition={{ duration: 1.8, ease: [0.45, 0, 0.2, 1], repeat: Infinity, repeatDelay: 4.5, delay: 0.4 }}
                  />
                </g>
              </g>
            )}

            {/* 4. 待機: 輪郭を巡る光 (回路のパルス) */}
            {done && !reduce && (
              <g filter="url(#bl-spark)">
                {LOGO_PATHS.map((d, i) => (
                  <motion.path
                    key={i}
                    d={d}
                    stroke={i === 1 ? "#a6e22e" : "#66d9ef"}
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    initial={{ pathLength: 0.06, pathOffset: 0, opacity: 0 }}
                    animate={{ pathOffset: 1, opacity: [0, 0.9, 0.9, 0] }}
                    transition={{
                      duration: 5 + i,
                      ease: "linear",
                      repeat: Infinity,
                      delay: 1 + i * 1.3,
                      opacity: { duration: 5 + i, times: [0, 0.1, 0.85, 1], repeat: Infinity, delay: 1 + i * 1.3 },
                    }}
                  />
                ))}
              </g>
            )}
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
}
