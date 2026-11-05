"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "framer-motion";
import styles from "./SkillNetwork.module.scss";

export interface SkillCategoryInput {
  name: string;
  colorClass: string;
  skills: string[];
}

interface Props {
  skillData: SkillCategoryInput[];
  hoveredSkill?: string | null;
}

/** colorClass → 描画色 (_variables.scss の $color-cat-* と同値) */
const CATEGORY_COLORS: Record<string, string> = {
  frontend: "#a6e22e",
  backend: "#e6db74",
  design: "#66d9ef",
  quality: "#f92672",
};

const SIZE = 600;
const CENTER = SIZE / 2;
/** 透視投影の焦点距離 — 大きいほどパースが弱く穏やかな回転に見える */
const FOCAL = 1000;
/** 四面体の外接球半径 (ハブからクラスタ中心までの距離) */
const RHO = 185;
/** クラスタ内ノードの分布半径 */
const CLUSTER_R = 62;
/**
  * 投影後の縦方向の中心。四面体は重心が上寄りに見えるので少し下げる
 */
const CENTER_Y = CENTER + RHO * 0.32;

/**
  * クラスタ中心 = 正四面体の頂点。0 が真上 (Frontend)、残り 3 つが下側の正三角形
 */
const CLUSTER_CENTERS = [
  { cx: 0, cy: -RHO, cz: 0 },
  ...[0, 1, 2].map((k) => {
    const a = (k * 2 * Math.PI) / 3 - Math.PI / 2;
    const br = RHO * ((2 * Math.SQRT2) / 3);
    return { cx: Math.cos(a) * br, cy: RHO / 3, cz: Math.sin(a) * br };
  }),
];

interface Node {
  x: number;
  y: number;
  z: number;
  r: number;
  color: string;
  skillName: string | null;
  /** クラスタのアンカーノードにはカテゴリ名を添える */
  category?: string;
}

interface Edge {
  from: number;
  to: number;
  color: string;
}

/**
  * フィボナッチ球面で配置 (乱数なしで SSR/CSR を一致させる)。ノード 0 はアンカー
 */
function generateCluster(cx: number, cy: number, cz: number, count: number) {
  const out: Array<{ x: number; y: number; z: number; r: number }> = [];
  if (count === 0) return out;
  out.push({ x: cx, y: cy, z: cz, r: 7.5 });
  const n = count - 1;
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = n === 1 ? 0 : 1 - (i / (n - 1)) * 2; // 1 → -1
    const ring = Math.sqrt(1 - y * y);
    const a = i * golden;
    out.push({
      x: cx + Math.cos(a) * ring * CLUSTER_R,
      y: cy + y * CLUSTER_R,
      z: cz + Math.sin(a) * ring * CLUSTER_R,
      r: 4 + (i % 3) * 0.8,
    });
  }
  return out;
}

function buildNetwork(categories: SkillCategoryInput[]) {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const anchors: number[] = [];

  categories.forEach((cat, ci) => {
    const center = CLUSTER_CENTERS[ci];
    if (!center) return;
    const color = CATEGORY_COLORS[cat.colorClass] ?? "#888";
    const start = nodes.length;
    anchors.push(start);

    generateCluster(center.cx, center.cy, center.cz, cat.skills.length).forEach((p, si) => {
      nodes.push({ ...p, color, skillName: cat.skills[si], category: si === 0 ? cat.name : undefined });
    });
    // Star: 各ノード → アンカー
    for (let i = 1; i < cat.skills.length; i++) edges.push({ from: start + i, to: start, color });
  });

  // ハブ (原点) → 各アンカー
  const hubIndex = nodes.length;
  nodes.push({ x: 0, y: 0, z: 0, r: 9, color: "#eeeeee", skillName: null });
  anchors.forEach((a) => edges.push({ from: hubIndex, to: a, color: nodes[a].color }));

  // ブリッジ: 四面体の 6 辺
  for (let a = 0; a < anchors.length; a++) {
    for (let b = a + 1; b < anchors.length; b++) {
      edges.push({ from: anchors[a], to: anchors[b], color: "#666" });
    }
  }

  return { nodes, edges, hubIndex };
}

/** Y 軸回転 → X 軸チルト → 透視投影 */
function project(nodes: Node[], angleY: number, tiltX: number) {
  const cosY = Math.cos(angleY);
  const sinY = Math.sin(angleY);
  const cosX = Math.cos(tiltX);
  const sinX = Math.sin(tiltX);
  return nodes.map((n) => {
    const rx = n.x * cosY - n.z * sinY;
    const rz = n.x * sinY + n.z * cosY;
    const ry = n.y * cosX - rz * sinX;
    const rz2 = n.y * sinX + rz * cosX;
    const scale = FOCAL / (FOCAL + rz2);
    // 奥ほど暗く小さくして奥行きを強調
    const depth = Math.min(Math.max(0.72 + (-rz2 / RHO) * 0.28, 0.4), 1);
    return { sx: CENTER + rx * scale, sy: CENTER_Y + ry * scale, scale, depth };
  });
}

function GlowFilter({ id, color }: { id: string; color: string }) {
  return (
    <filter id={id} x="-100%" y="-100%" width="300%" height="300%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
      <feFlood floodColor={color} floodOpacity="0.7" result="c" />
      <feComposite in="c" in2="blur" operator="in" result="glow" />
      <feMerge>
        <feMergeNode in="glow" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  );
}

const filterId = (color: string) => `sn-glow-${color.replace("#", "")}`;

/** スキルのつながりを 3D の星座で見せる。リストのホバーで対応ノードと接続先を強調する */
export default function SkillNetwork({ skillData, hoveredSkill = null }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { nodes, edges, hubIndex } = useMemo(() => buildNetwork(skillData), [skillData]);

  const [time, setTime] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!inView) return;
    const fade = setTimeout(() => setVisible(true), 200);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => clearTimeout(fade);

    let raf = 0;
    let start: number | null = null;
    const tick = (t: number) => {
      if (start === null) start = t;
      setTime((t - start) / 1000);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      clearTimeout(fade);
      cancelAnimationFrame(raf);
    };
  }, [inView]);

  // ホバー中ノードと、その直接の接続先
  const hoveredIndex = hoveredSkill ? nodes.findIndex((n) => n.skillName === hoveredSkill) : -1;
  const litNodes = new Set<number>();
  const litEdges = new Set<number>();
  if (hoveredIndex >= 0) {
    litNodes.add(hoveredIndex);
    edges.forEach((e, i) => {
      if (e.from === hoveredIndex || e.to === hoveredIndex) {
        litEdges.add(i);
        litNodes.add(e.from);
        litNodes.add(e.to);
      }
    });
  }
  const focus = hoveredIndex >= 0;
  // ≈52秒/周の Y 回転 + 揺れる俯瞰角
  const angleY = 0.5 + time * 0.12;
  const tiltX = 0.4 + Math.sin(time * 0.25) * 0.12;
  const projected = project(nodes, angleY, tiltX);
  const colors = Array.from(new Set(nodes.map((n) => n.color)));

  return (
    <div ref={ref} className={styles.wrap}>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        role="img"
        aria-label="スキルのつながりを表すネットワーク図"
        style={{ opacity: visible ? 1 : 0 }}
      >
        <defs>
          {colors.map((c) => (
            <GlowFilter key={c} id={filterId(c)} color={c} />
          ))}
        </defs>

        <circle cx={CENTER} cy={CENTER} r={CENTER - 8} className={styles.orbit} />
        <circle cx={CENTER} cy={CENTER} r={CENTER * 0.62} className={styles.orbit} />

        {edges.map((e, i) => {
          const a = projected[e.from];
          const b = projected[e.to];
          const lit = litEdges.has(i);
          return (
            <line
              key={`e${i}`}
              x1={a.sx}
              y1={a.sy}
              x2={b.sx}
              y2={b.sy}
              stroke={e.color}
              strokeWidth={(lit ? 2.2 : 1.2) * ((a.scale + b.scale) / 2)}
              opacity={focus ? (lit ? 1 : 0.08) : 0.7 * ((a.depth + b.depth) / 2)}
              className={styles.fade}
            />
          );
        })}

        {nodes.map((n, i) => {
          const p = projected[i];
          const isHub = i === hubIndex;
          const lit = litNodes.has(i);
          const dimmed = focus && !lit && !isHub;
          const r = n.r * p.scale * (i === hoveredIndex ? 1.6 : 1);
          return (
            <g key={`n${i}`} className={styles.fade} opacity={dimmed ? 0.18 : focus ? 1 : p.depth}>
              <circle cx={p.sx} cy={p.sy} r={r} fill={n.color} filter={`url(#${filterId(n.color)})`} />
              {i === hoveredIndex && (
                <>
                  <circle className={styles.pulse1} cx={p.sx} cy={p.sy} r={r * 2.6} stroke={n.color} />
                  <circle className={styles.pulse2} cx={p.sx} cy={p.sy} r={r * 4.4} stroke={n.color} />
                </>
              )}
              {/* カテゴリ名 (アンカー) とホバー中のスキル名 */}
              {(n.category || i === hoveredIndex) && (
                <text
                  x={p.sx + r + 8}
                  y={p.sy - r - 4}
                  className={i === hoveredIndex ? styles.skillLabel : styles.catLabel}
                  fill={n.color}
                >
                  {i === hoveredIndex ? n.skillName : n.category}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
