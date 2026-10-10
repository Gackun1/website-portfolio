"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, animate, motion, useAnimationFrame, useReducedMotion } from "framer-motion";
import styles from "./AboutDiagram.module.scss";

/**
 * AboutDiagram — Services の 3 領域をそれぞれ 1 枚の図で見せる
 *
 * 0. Frontend & CMS    : コンテンツ → コンポーネント → ビュー の 3 層を分解したアイソメトリック図
 * 1. Design & Motion   : イージングカーブと、その速度感で動くオブジェクト
 * 2. SEO & Performance : スコアリングと Core Web Vitals のメーター
 *
 * active は AboutSection 側のホバー / フォーカスで切り替わる。
 */

export const DIAGRAM_COLORS = ["#a6e22e", "#66d9ef", "#e6db74"] as const;

const VIEW_W = 480;
const VIEW_H = 400;
const ease = [0.22, 1, 0.36, 1] as const;

// ==========================================
// 0. Frontend & CMS — exploded isometric stack
// ==========================================

const ISO_COS = Math.cos(Math.PI / 6);
const ISO_W = 170;
const ISO_CX = 200;
const ISO_CY = 115;
const LAYER_GAP = 100;

/** レイヤー平面上の (u, v) ∈ [0, 1] と高さ z を画面座標へ */
function iso(u: number, v: number, z: number) {
  const x = u * ISO_W;
  const y = v * ISO_W;
  return [ISO_CX + (x - y) * ISO_COS, ISO_CY + (x + y) * 0.5 - z] as const;
}

function plane(u0: number, v0: number, u1: number, v1: number, z: number) {
  return [iso(u0, v0, z), iso(u1, v0, z), iso(u1, v1, z), iso(u0, v1, z)].map((p) => p.join(",")).join(" ");
}

const LAYERS = [
  { z: -LAYER_GAP, label: "CONTENT" },
  { z: 0, label: "COMPONENT" },
  { z: LAYER_GAP, label: "VIEW" },
];

function LayerContent({ index, z, color }: { index: number; z: number; color: string }) {
  if (index === 0) {
    // CMS のエントリー = key / value の行
    return (
      <>
        {[0, 1, 2, 3].map((i) => {
          const v = 0.14 + i * 0.19;
          return (
            <g key={i}>
              <polygon points={plane(0.12, v, 0.32, v + 0.1, z)} fill={color} opacity={0.55} />
              <polygon points={plane(0.38, v, 0.88, v + 0.1, z)} fill="#eee" opacity={0.12} />
            </g>
          );
        })}
      </>
    );
  }
  if (index === 1) {
    // 再利用できる部品のタイル
    const lit = new Set([0, 4, 5, 7]);
    return (
      <>
        {[0, 1, 2].flatMap((r) =>
          [0, 1, 2].map((c) => {
            const u = 0.1 + c * 0.28;
            const v = 0.1 + r * 0.28;
            const on = lit.has(r * 3 + c);
            return (
              <polygon
                key={`${r}-${c}`}
                points={plane(u, v, u + 0.24, v + 0.24, z)}
                fill={on ? color : "none"}
                fillOpacity={on ? 0.28 : 0}
                stroke={on ? color : "#eee"}
                strokeOpacity={on ? 0.9 : 0.18}
                strokeWidth={1}
              />
            );
          })
        )}
      </>
    );
  }
  // ブラウザに描画された画面のワイヤーフレーム
  return (
    <>
      <polygon points={plane(0.08, 0.08, 0.92, 0.17, z)} fill="#eee" opacity={0.18} />
      <polygon points={plane(0.08, 0.23, 0.92, 0.54, z)} fill={color} opacity={0.32} />
      {[0.08, 0.37, 0.66].map((u) => (
        <polygon key={u} points={plane(u, 0.6, u + 0.26, 0.92, z)} fill="#eee" opacity={0.1} />
      ))}
    </>
  );
}

function StackDiagram({ color, still }: { color: string; still: boolean }) {
  // 各レイヤーの手前・左右の角を縦に結ぶ — データが下から上へ流れる経路
  const corners: Array<[number, number]> = [
    [0, 1],
    [1, 1],
    [1, 0],
  ];

  return (
    <>
      {corners.map(([u, v], i) => {
        const [x, yTop] = iso(u, v, LAYER_GAP);
        const [, yBottom] = iso(u, v, -LAYER_GAP);
        return (
          <g key={i}>
            <line x1={x} y1={yTop} x2={x} y2={yBottom} className={styles.dash} />
            {!still && (
              <motion.circle
                cx={x}
                r={2.5}
                fill={color}
                initial={{ cy: yBottom, opacity: 0 }}
                animate={{ cy: [yBottom, yTop], opacity: [0, 1, 1, 0] }}
                transition={{ duration: 2.4, ease: "easeInOut", repeat: Infinity, delay: 0.6 + i * 0.7 }}
              />
            )}
          </g>
        );
      })}

      {LAYERS.map((layer, i) => {
        const [lx, ly] = iso(1, 0, layer.z);
        return (
          <motion.g
            key={layer.label}
            initial={{ opacity: 0, y: (1 - i) * -44 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.08 + i * 0.1 }}
          >
            <polygon points={plane(0, 0, 1, 1, layer.z)} className={styles.plane} stroke={color} />
            <LayerContent index={i} z={layer.z} color={color} />
            <line x1={lx + 8} y1={ly} x2={lx + 26} y2={ly} className={styles.leader} />
            <text x={lx + 32} y={ly + 4} className={styles.label}>
              {layer.label}
            </text>
          </motion.g>
        );
      })}
    </>
  );
}

// ==========================================
// 1. Design & Motion — easing curve
// ==========================================

const G_X = 90;
const G_Y = 316;
const G_W = 300;
const G_H = 220;
/** サイト全体で使っている ease-out-expo */
const BEZIER = [0.22, 1, 0.36, 1] as const;

function bezier(u: number) {
  const [x1, y1, x2, y2] = BEZIER;
  const m = 1 - u;
  const k1 = 3 * m * m * u;
  const k2 = 3 * m * u * u;
  const k3 = u * u * u;
  return { x: k1 * x1 + k2 * x2 + k3, y: k1 * y1 + k2 * y2 + k3 };
}

const gx = (x: number) => G_X + x * G_W;
const gy = (y: number) => G_Y - y * G_H;
const TRACK_Y = 366;
const CYCLE = 3.4;
const RUN = 2.2;

function EasingDiagram({ color, still }: { color: string; still: boolean }) {
  const [u, setU] = useState(still ? 1 : 0);

  useAnimationFrame((t) => {
    if (still) return;
    const s = (t / 1000) % CYCLE;
    setU(Math.min(Math.max((s - 0.5) / RUN, 0), 1));
  });

  const p = bezier(u);
  const [x1, y1, x2, y2] = BEZIER;
  const curve = `M${gx(0)},${gy(0)} C${gx(x1)},${gy(y1)} ${gx(x2)},${gy(y2)} ${gx(1)},${gy(1)}`;
  // 等間隔の時間で打ったゴースト = イージングの "間" を可視化
  const ghosts = Array.from({ length: 11 }, (_, i) => bezier(i / 10).y);

  return (
    <>
      {/* 12 カラムのレイアウトグリッド */}
      {Array.from({ length: 12 }, (_, i) => (
        <rect key={i} x={30 + i * 36} y={20} width={24} height={VIEW_H - 40} className={styles.column} />
      ))}

      <text x={G_X} y={56} className={styles.code} fill={color}>
        cubic-bezier(.22, 1, .36, 1)
      </text>

      {[0.25, 0.5, 0.75, 1].map((g) => (
        <g key={g}>
          <line x1={gx(0)} y1={gy(g)} x2={gx(1)} y2={gy(g)} className={styles.grid} />
          <line x1={gx(g)} y1={gy(0)} x2={gx(g)} y2={gy(1)} className={styles.grid} />
        </g>
      ))}
      <line x1={gx(0)} y1={gy(0)} x2={gx(1)} y2={gy(0)} className={styles.axis} />
      <line x1={gx(0)} y1={gy(0)} x2={gx(0)} y2={gy(1)} className={styles.axis} />

      {/* ハンドル */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.6 }}>
        <line x1={gx(0)} y1={gy(0)} x2={gx(x1)} y2={gy(y1)} className={styles.handle} />
        <line x1={gx(1)} y1={gy(1)} x2={gx(x2)} y2={gy(y2)} className={styles.handle} />
        <circle cx={gx(x1)} cy={gy(y1)} r={5} className={styles.handleDot} stroke={color} />
        <circle cx={gx(x2)} cy={gy(y2)} r={5} className={styles.handleDot} stroke={color} />
      </motion.g>

      <motion.path
        d={curve}
        fill="none"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.1, ease }}
      />

      {/* 現在位置 */}
      <line x1={gx(p.x)} y1={gy(p.y)} x2={gx(0)} y2={gy(p.y)} className={styles.guide} stroke={color} />
      <line x1={gx(p.x)} y1={gy(p.y)} x2={gx(p.x)} y2={gy(0)} className={styles.guide} stroke={color} />
      <circle cx={gx(p.x)} cy={gy(p.y)} r={6} fill={color} className={styles.glow} style={{ color }} />

      {/* トラック: 同じイージングで動くオブジェクト */}
      <line x1={gx(0)} y1={TRACK_Y} x2={gx(1)} y2={TRACK_Y} className={styles.axis} />
      {ghosts.map((g, i) => (
        <line key={i} x1={gx(g)} y1={TRACK_Y - 5} x2={gx(g)} y2={TRACK_Y + 5} className={styles.tick} />
      ))}
      <rect x={gx(p.y) - 9} y={TRACK_Y - 9} width={18} height={18} rx={3} fill={color} className={styles.glow} style={{ color }} />
    </>
  );
}

// ==========================================
// 2. SEO & Performance — score gauge
// ==========================================

const RING_X = 150;
const RING_Y = 190;
const RING_R = 92;

const METRICS = [
  { key: "LCP", value: "0.9s", ratio: 0.82 },
  { key: "INP", value: "48ms", ratio: 0.9 },
  { key: "CLS", value: "0.01", ratio: 0.96 },
];

function ScoreDiagram({ color, still }: { color: string; still: boolean }) {
  const [score, setScore] = useState(still ? 100 : 0);

  useEffect(() => {
    if (still) return;
    const controls = animate(0, 100, { duration: 1.6, ease, delay: 0.2, onUpdate: (v) => setScore(Math.round(v)) });
    return () => controls.stop();
  }, [still]);

  return (
    <>
      {/* 目盛り */}
      {Array.from({ length: 60 }, (_, i) => {
        const a = (i / 60) * Math.PI * 2 - Math.PI / 2;
        const lit = i / 60 < score / 100;
        const r0 = RING_R + 16;
        const r1 = RING_R + (i % 5 === 0 ? 26 : 21);
        return (
          <line
            key={i}
            x1={RING_X + Math.cos(a) * r0}
            y1={RING_Y + Math.sin(a) * r0}
            x2={RING_X + Math.cos(a) * r1}
            y2={RING_Y + Math.sin(a) * r1}
            stroke={lit ? color : "#eee"}
            strokeOpacity={lit ? 0.7 : 0.15}
            strokeWidth={1}
          />
        );
      })}
      <circle cx={RING_X} cy={RING_Y} r={RING_R} className={styles.track} />
      <motion.circle
        cx={RING_X}
        cy={RING_Y}
        r={RING_R}
        fill="none"
        stroke={color}
        strokeWidth={8}
        strokeLinecap="round"
        transform={`rotate(-90 ${RING_X} ${RING_Y})`}
        initial={{ pathLength: still ? 1 : 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.6, ease, delay: 0.2 }}
        className={styles.glow}
        style={{ color }}
      />
      <text x={RING_X} y={RING_Y + 18} textAnchor="middle" className={styles.score}>
        {score}
      </text>

      {METRICS.map((m, i) => {
        const y = 110 + i * 82;
        return (
          <motion.g
            key={m.key}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.3 + i * 0.12 }}
          >
            <text x={300} y={y} className={styles.label}>
              {m.key}
            </text>
            <text x={440} y={y} textAnchor="end" className={styles.metric}>
              {m.value}
            </text>
            <rect x={300} y={y + 14} width={140} height={3} rx={1.5} className={styles.bar} />
            <motion.rect
              x={300}
              y={y + 14}
              height={3}
              rx={1.5}
              fill={color}
              initial={{ width: still ? 140 * m.ratio : 0 }}
              animate={{ width: 140 * m.ratio }}
              transition={{ duration: 1.2, ease, delay: 0.45 + i * 0.12 }}
            />
          </motion.g>
        );
      })}
    </>
  );
}

// ==========================================
// Frame
// ==========================================

const LABELS = ["Frontend & CMS", "Design & Motion", "SEO & Performance"];

export default function AboutDiagram({ active }: { active: number }) {
  const reduced = useReducedMotion() ?? false;
  const color = DIAGRAM_COLORS[active];

  return (
    <div className={styles.frame} style={{ ["--accent" as string]: color }}>
      <svg className={styles.svg} viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} role="img" aria-label={LABELS[active]}>
        <AnimatePresence mode="wait">
          <motion.g
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {active === 0 && <StackDiagram color={color} still={reduced} />}
            {active === 1 && <EasingDiagram color={color} still={reduced} />}
            {active === 2 && <ScoreDiagram color={color} still={reduced} />}
          </motion.g>
        </AnimatePresence>
      </svg>

      {/* 四隅のトンボ */}
      <span className={`${styles.corner} ${styles.tl}`} />
      <span className={`${styles.corner} ${styles.tr}`} />
      <span className={`${styles.corner} ${styles.bl}`} />
      <span className={`${styles.corner} ${styles.br}`} />
    </div>
  );
}
