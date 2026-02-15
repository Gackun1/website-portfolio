"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import styles from "./GeometricShapes.module.scss";

/**
 * GeometricShapes — About / Skills セクション用の装飾グラフィック
 *
 * ■ デザイン意図
 *   サイト全体のダーク+ターミナル美学（モノスペース、ネオングロー、暗背景）を
 *   セクションごとに"語りかける視覚言語"として拡張する。
 *   HeroSection の AnimatedSVG（ストローク描画 → グロー）で確立したパターンを
 *   継承しつつ、各セクションの"メッセージ"に合わせた固有の構図を持たせる。
 *
 * ■ variant="about" — Isometric Digital Architecture
 *   コンセプト:「デジタルの世界を設計し、構築する」
 *   ・アイソメトリック投影のグリッド床 + 4棟のワイヤーフレーム建築物で
 *     "コードで空間を建てる"行為を視覚化。
 *   ・高さの異なる構造体（h=5,3,2,1）はスキルの多層性を暗示。
 *   ・最も高い塔の上に浮遊する緑の八面体は"創造性・ビジョン"のメタファー。
 *   ・描画フェーズ: 床グリッド → 構造体 → 八面体 の3段階で、
 *     建設プロセスそのものを追体験させる。
 *   ・色: 青(#66d9ef)=設計図の冷静さ、緑(#a6e22e)=ターミナルの生命感。
 *   ・レイアウト: セクション右側に大きく配置し、テキストを左55%に収めることで
 *     グラフィックに"自分の領域"を与える。
 *
 * ■ variant="skills" — 3D Neural Constellation (データ駆動)
 *   コンセプト:「すべてのスキルはひとつの繋がった立体システムを成す」
 *   ・skillData から動的に3Dノードを生成 — スキルが増えれば頂点も増える。
 *   ・各ノードは golden angle (黄金角) 螺旋で3D空間に配置。
 *   ・Y軸を中心にゆっくり回転（≈52秒/周）+ X軸15°チルトで俯瞰アングル。
 *   ・透視投影で遠近感を表現 — 手前のノードは大きく、奥は小さく。
 *   ・中央の白いハブノードから各クラスタへ放射状に接続し、
 *     クラスタ間にもブリッジ(dim gray)を架けることで
 *     "分野横断的な統合力"を表現。
 *   ・ホバー連動: スキルバッジにマウスを乗せると、対応する背景ノードが
 *     パルスリングで発光し、接続エッジも明滅。他ノードは減光して
 *     フォーカスを強調する。
 *
 * ■ アニメーション設計
 *   ・スクロールで viewport に入った瞬間（useInView, once）に描画開始。
 *   ・About: pathLength 0→1 のストローク描画 → CSS float で浮遊。
 *   ・Skills: フェードイン → requestAnimationFrame で3D回転。
 *   ・prefers-reduced-motion 時はすべてのアニメーションを停止。
 */

/* -------------------------------------------------- */
/*  Types                                             */
/* -------------------------------------------------- */

type Variant = "about" | "skills";

/** SkillsSection から受け取るカテゴリデータ */
export interface SkillCategoryInput {
  colorClass: string;
  skills: string[];
}

interface Props {
  variant: Variant;
  /** skills variant: カテゴリ配列。ノード数はここから自動算出される */
  skillData?: SkillCategoryInput[];
  /** skills variant: 現在ホバー中のスキル名。対応ノードが発光する */
  hoveredSkill?: string | null;
}

/* -------------------------------------------------- */
/*  Isometric helper: grid coords → SVG screen coords */
/*  x軸=右奥, y軸=左奥, z軸=上方向                      */
/* -------------------------------------------------- */
function iso(x: number, y: number, z: number = 0): string {
  const sx = 250 + (x - y) * 38;
  const sy = 280 + (x + y) * 22 - z * 30;
  return `${sx} ${sy}`;
}

/* -------------------------------------------------- */
/*  Shared animated path                              */
/*  pathLength 0→1 でストロークが "描かれる" 演出。      */
/*  delay の段階制御で描画順序（床→構造体→装飾）を表現。 */
/* -------------------------------------------------- */
function DrawPath({
  d,
  color,
  delay,
  strokeWidth = 1,
  inView,
}: {
  d: string;
  color: string;
  delay: number;
  strokeWidth?: number;
  inView: boolean;
}) {
  return (
    <motion.path
      d={d}
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
      strokeLinecap="round"
      fill="none"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={inView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
      transition={{
        pathLength: { duration: 1.2, ease: "easeInOut", delay },
        opacity: { duration: 0.4, delay },
      }}
    />
  );
}

/* -------------------------------------------------- */
/*  Glow filter                                       */
/*  HeroSection の drop-shadow グローと同じ視覚言語。   */
/*  SourceGraphic を残しつつぼかしレイヤーを重ねることで */
/*  ネオン管のような発光効果を再現する。                 */
/* -------------------------------------------------- */
function GlowFilter({ id, color, std = 2 }: { id: string; color: string; std?: number }) {
  return (
    <filter id={id} x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceGraphic" stdDeviation={std} result="blur" />
      <feFlood floodColor={color} floodOpacity="0.5" result="color" />
      <feComposite in="color" in2="blur" operator="in" result="glow" />
      <feMerge>
        <feMergeNode in="glow" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  );
}

/* ================================================== */
/*  ABOUT: Isometric Digital Architecture             */
/*  コンセプト: 「デジタルの世界を設計し、構築する」      */
/*                                                    */
/*  構図:                                              */
/*    4×4 のアイソメトリックグリッド床を基盤に、          */
/*    高さの異なる4棟の建築物が立ち上がる。              */
/*    最も高い塔(h=5)の上には緑の八面体が浮遊し、       */
/*    "技術の土台の上にビジョンが宿る" ことを示す。      */
/*                                                    */
/*  描画順序:                                          */
/*    Phase 1 — 床グリッド (0s~)     : 基盤の構築       */
/*    Phase 2 — 構造体     (0.5s~)   : 建物が立ち上がる */
/*    Phase 3 — 八面体     (1.6s~)   : ビジョンの出現   */
/*                                                    */
/*  色の意図:                                          */
/*    青(#66d9ef) — 設計図・ブループリントの冷静さ       */
/*    緑(#a6e22e) — ターミナルの生命感、創造のアクセント */
/* ================================================== */

/** グリッド座標から1棟分のワイヤーフレーム(垂直辺4本+天面1枚)を生成 */
function buildStructureEdges(
  ox: number, oy: number, w: number, d: number, h: number,
): string[] {
  const paths: string[] = [];
  const corners = [
    [ox, oy],
    [ox + w, oy],
    [ox + w, oy + d],
    [ox, oy + d],
  ];
  for (const [cx, cy] of corners) {
    paths.push(`M${iso(cx, cy, 0)} L${iso(cx, cy, h)}`);
  }
  paths.push(
    `M${iso(corners[0][0], corners[0][1], h)} ` +
    `L${iso(corners[1][0], corners[1][1], h)} ` +
    `L${iso(corners[2][0], corners[2][1], h)} ` +
    `L${iso(corners[3][0], corners[3][1], h)} Z`,
  );
  return paths;
}

function ArchitectureGraphic({ inView }: { inView: boolean }) {
  const blue = "#66d9ef";
  const green = "#a6e22e";

  const floorPaths = [
    `M${iso(0, 0)} L${iso(4, 0)} L${iso(4, 4)} L${iso(0, 4)} Z`,
    `M${iso(1, 0)} L${iso(1, 4)}`,
    `M${iso(2, 0)} L${iso(2, 4)}`,
    `M${iso(3, 0)} L${iso(3, 4)}`,
    `M${iso(0, 1)} L${iso(4, 1)}`,
    `M${iso(0, 2)} L${iso(4, 2)}`,
    `M${iso(0, 3)} L${iso(4, 3)}`,
  ];

  // 構造体: 高さの差でスキルの多層性を暗示
  const structurePaths = [
    ...buildStructureEdges(1, 1, 1, 1, 5), // 主塔 — 最も高く、八面体の土台
    ...buildStructureEdges(3, 0, 1, 1, 3), // 中棟(右奥) — 安定感のある高さ
    ...buildStructureEdges(0, 3, 1, 1, 2), // 低棟(左手前) — 対角配置でバランス
    ...buildStructureEdges(3, 3, 1, 1, 1), // 基壇(右手前) — 地に足のついた基盤
  ];

  // 浮遊する八面体: "技術の上に宿るビジョン・創造性"
  const accentPaths = [
    `M${iso(1.5, 1.5, 5)} L${iso(1.5, 1.5, 6.5)}`,
    `M${iso(2, 1.5, 7.5)} L${iso(1.5, 2, 7.5)} L${iso(1, 1.5, 7.5)} L${iso(1.5, 1, 7.5)} Z`,
    `M${iso(1.5, 1.5, 8.5)} L${iso(2, 1.5, 7.5)}`,
    `M${iso(1.5, 1.5, 8.5)} L${iso(1.5, 2, 7.5)}`,
    `M${iso(1.5, 1.5, 8.5)} L${iso(1, 1.5, 7.5)}`,
    `M${iso(1.5, 1.5, 8.5)} L${iso(1.5, 1, 7.5)}`,
    `M${iso(1.5, 1.5, 6.5)} L${iso(2, 1.5, 7.5)}`,
    `M${iso(1.5, 1.5, 6.5)} L${iso(1.5, 2, 7.5)}`,
    `M${iso(1.5, 1.5, 6.5)} L${iso(1, 1.5, 7.5)}`,
    `M${iso(1.5, 1.5, 6.5)} L${iso(1.5, 1, 7.5)}`,
  ];

  return (
    <svg className={styles.svg} viewBox="0 0 500 500" fill="none">
      <defs>
        <GlowFilter id="gl-arch-blue" color={blue} />
        <GlowFilter id="gl-arch-green" color={green} std={3} />
      </defs>
      <g filter="url(#gl-arch-blue)">
        {floorPaths.map((d, i) => (
          <DrawPath key={`f${i}`} d={d} color={blue} delay={i * 0.06} strokeWidth={0.7} inView={inView} />
        ))}
      </g>
      <g filter="url(#gl-arch-blue)">
        {structurePaths.map((d, i) => (
          <DrawPath key={`s${i}`} d={d} color={blue} delay={0.5 + i * 0.04} inView={inView} />
        ))}
      </g>
      <g filter="url(#gl-arch-green)">
        {accentPaths.map((d, i) => (
          <DrawPath key={`a${i}`} d={d} color={green} delay={1.6 + i * 0.06} strokeWidth={1.2} inView={inView} />
        ))}
      </g>
    </svg>
  );
}

/* ================================================== */
/*  SKILLS: 3D Neural Constellation (データ駆動)       */
/*  コンセプト: 「すべてのスキルは繋がった立体システム」  */
/*                                                    */
/*  3D空間:                                            */
/*    原点(0,0,0)を中心に4クラスタ+ハブを配置。          */
/*    各クラスタの z をずらすことで回転時に奥行き感が出る。*/
/*                                                    */
/*  回転:                                              */
/*    Y軸を中心に ≈52秒/周のゆっくりした回転。           */
/*    X軸15°チルトで "やや上からの俯瞰" アングル。      */
/*    透視投影(焦点距離600)で手前は大きく、奥は小さく。  */
/*                                                    */
/*  ノード生成:                                        */
/*    golden angle 螺旋で3D空間に配置。                  */
/*    y方向を0.7倍圧縮、z方向は sin(angle+1.2)*dist*0.6 */
/*    で自然な立体分布を生成する。                       */
/*                                                    */
/*  ホバー連動:                                        */
/*    hoveredSkill に対応するノードがパルスリングで発光。 */
/*    接続先ノード・エッジは明るく保ち、それ以外を減光。 */
/* ================================================== */

/** colorClass → SVG 描画色 (_variables.scss の $color-cat-* と同値) */
const CATEGORY_COLORS: Record<string, string> = {
  frontend: "#a6e22e",
  backend: "#e6db74",
  design: "#66d9ef",
  quality: "#f92672",
};

/** 透視投影の焦点距離 — 大きいほどパースが弱く穏やかな回転に見える */
const FOCAL = 600;

/** X軸チルト(≈15°) — 正面やや上からの俯瞰アングル */
const TILT_X = 0.25;

/**
 * クラスタ中心の3D座標 — 原点を中心に四象限に配置。
 * z値をずらすことで回転時に前後の奥行き感が生まれる。
 * 左上=Frontend, 右上=Backend, 左下=Design, 右下=Quality。
 */
const CLUSTER_CENTERS_3D = [
  { cx: -180, cy: -80, cz: -30 },
  { cx: 180, cy: -80, cz: 20 },
  { cx: -180, cy: 80, cz: 20 },
  { cx: 180, cy: 80, cz: -30 },
];

interface GenNode {
  x: number;
  y: number;
  z: number;
  r: number;
  color: string;
  /** このノードに対応するスキル名。ハブは null */
  skillName: string | null;
}

interface GenEdge {
  from: number;
  to: number;
  color: string;
}

/**
 * Golden angle 螺旋で3D空間にクラスタ内ノードを配置する。
 * 決定論的（乱数なし）なので SSR/CSR で結果が一致する。
 * ノード 0 は中心 = カテゴリの "アンカー" ノード。
 * y方向を圧縮し、z方向に sin で散らすことで自然な立体分布になる。
 */
function generateCluster3D(
  cx: number, cy: number, cz: number, count: number, spread = 65,
): Array<{ x: number; y: number; z: number; r: number }> {
  if (count === 0) return [];
  const result: Array<{ x: number; y: number; z: number; r: number }> = [];
  // 中心ノード — カテゴリの代表、最大半径
  result.push({ x: cx, y: cy, z: cz, r: 4.5 });
  const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // ≈ 137.5°
  for (let i = 1; i < count; i++) {
    const angle = i * goldenAngle;
    const dist = spread * Math.sqrt(i / count) * 1.2;
    result.push({
      x: cx + Math.cos(angle) * dist,
      y: cy + Math.sin(angle) * dist * 0.7,
      z: cz + Math.sin(angle + 1.2) * dist * 0.6,
      r: 2.5 + (i % 3) * 0.5,
    });
  }
  return result;
}

/** skillData から3Dノード・エッジを一括生成する (メモ化用) */
function buildNetwork3D(categories: SkillCategoryInput[]) {
  const nodes: GenNode[] = [];
  const edges: GenEdge[] = [];
  const clusterStarts: number[] = [];
  const dim = "#555";

  // --- ノード + Star エッジ ---
  categories.forEach((cat, ci) => {
    const color = CATEGORY_COLORS[cat.colorClass] ?? "#888";
    const center = CLUSTER_CENTERS_3D[ci];
    if (!center) return;

    const start = nodes.length;
    clusterStarts.push(start);

    const positions = generateCluster3D(
      center.cx, center.cy, center.cz, cat.skills.length,
    );
    positions.forEach((pos, si) => {
      nodes.push({ ...pos, color, skillName: cat.skills[si] });
    });

    // Star: 各末端ノード → 中心ノード
    for (let i = 1; i < cat.skills.length; i++) {
      edges.push({ from: start + i, to: start, color });
    }
  });

  // --- ハブノード(原点) ---
  const hubIndex = nodes.length;
  nodes.push({ x: 0, y: 0, z: 0, r: 5, color: "#eee", skillName: null });

  // --- Hub エッジ: ハブ → 各クラスタ中心 ---
  clusterStarts.forEach((start, ci) => {
    const color = CATEGORY_COLORS[categories[ci].colorClass] ?? "#888";
    edges.push({ from: hubIndex, to: start, color });
  });

  // --- Bridge エッジ: 隣接クラスタ間を dim gray で接続 ---
  const bridgePairs = [
    [0, 1], // 上辺: Frontend ↔ Backend
    [2, 3], // 下辺: Design ↔ Quality
    [0, 2], // 左辺: Frontend ↔ Design
    [1, 3], // 右辺: Backend ↔ Quality
  ];
  bridgePairs.forEach(([a, b]) => {
    if (a < categories.length && b < categories.length) {
      const aNode = clusterStarts[a] + Math.min(1, categories[a].skills.length - 1);
      const bNode = clusterStarts[b] + Math.min(1, categories[b].skills.length - 1);
      edges.push({ from: aNode, to: bNode, color: dim });
    }
  });

  return { nodes, edges, hubIndex };
}

/**
 * 3D座標を2Dスクリーン座標に投影する。
 * Y軸回転 → X軸チルト → 透視投影 の3段階。
 * cos/sin は全ノード共通なので一括で投影して効率化。
 */
function projectAll(
  nodes: GenNode[],
  angleY: number,
): Array<{ sx: number; sy: number; scale: number }> {
  const cosY = Math.cos(angleY);
  const sinY = Math.sin(angleY);
  const cosX = Math.cos(TILT_X);
  const sinX = Math.sin(TILT_X);

  return nodes.map((n) => {
    // Y軸回転
    const rx = n.x * cosY - n.z * sinY;
    const rz = n.x * sinY + n.z * cosY;
    // X軸チルト
    const ry2 = n.y * cosX - rz * sinX;
    const rz2 = n.y * sinX + rz * cosX;
    // 透視投影
    const scale = FOCAL / (FOCAL + rz2);
    return {
      sx: 400 + rx * scale,
      sy: 200 + ry2 * scale,
      scale,
    };
  });
}

/** hoveredSkill に関連するノード・エッジの index を算出する */
function getHighlightSets(
  nodes: GenNode[], edges: GenEdge[], hoveredSkill: string | null,
) {
  const highlightedNodes = new Set<number>();
  const highlightedEdges = new Set<number>();

  if (!hoveredSkill) return { highlightedNodes, highlightedEdges, anyHovered: false };

  const idx = nodes.findIndex((n) => n.skillName === hoveredSkill);
  if (idx < 0) return { highlightedNodes, highlightedEdges, anyHovered: false };

  highlightedNodes.add(idx);

  // ホバーノードに直接つながるエッジとその先のノードも明るくする
  edges.forEach((e, i) => {
    if (e.from === idx || e.to === idx) {
      highlightedEdges.add(i);
      highlightedNodes.add(e.from);
      highlightedNodes.add(e.to);
    }
  });

  return { highlightedNodes, highlightedEdges, anyHovered: true };
}

/** ノード色 → glow filter ID */
const filterIdFor = (color: string) =>
  color === "#a6e22e" ? "gl-net-g" :
  color === "#e6db74" ? "gl-net-y" :
  color === "#66d9ef" ? "gl-net-b" :
  color === "#f92672" ? "gl-net-r" : "gl-net-w";

function NetworkGraphic({
  inView,
  skillData,
  hoveredSkill,
}: {
  inView: boolean;
  skillData?: SkillCategoryInput[];
  hoveredSkill?: string | null;
}) {
  const categories = skillData ?? [];

  // ノード・エッジはスキルデータが変わらない限り再計算しない
  const { nodes, edges, hubIndex } = useMemo(
    () => buildNetwork3D(categories),
    [categories],
  );

  const [angle, setAngle] = useState(0);
  const [visible, setVisible] = useState(false);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (!inView) return;

    // フェードイン開始
    const fadeTimer = setTimeout(() => setVisible(true), 300);

    // prefers-reduced-motion: 回転を停止
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return () => clearTimeout(fadeTimer);

    // フェードイン完了後に3D回転を開始
    const rotTimer = setTimeout(() => {
      const animate = (time: number) => {
        if (startRef.current === null) startRef.current = time;
        const elapsed = (time - startRef.current) / 1000;
        setAngle(elapsed * 0.12); // ≈52秒/周
        rafRef.current = requestAnimationFrame(animate);
      };
      rafRef.current = requestAnimationFrame(animate);
    }, 1500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(rotTimer);
      cancelAnimationFrame(rafRef.current);
    };
  }, [inView]);

  const { highlightedNodes, highlightedEdges, anyHovered } =
    getHighlightSets(nodes, edges, hoveredSkill ?? null);

  // ホバー中の実ノード index (パルスリング描画用)
  const pulseIndex = hoveredSkill
    ? nodes.findIndex((n) => n.skillName === hoveredSkill)
    : -1;

  // 全ノードを現在の回転角で2Dに投影
  const projected = projectAll(nodes, angle);

  return (
    <svg
      className={styles.svg}
      viewBox="0 0 800 400"
      fill="none"
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 1.2s ease",
      }}
    >
      <defs>
        <GlowFilter id="gl-net-g" color="#a6e22e" />
        <GlowFilter id="gl-net-y" color="#e6db74" />
        <GlowFilter id="gl-net-b" color="#66d9ef" />
        <GlowFilter id="gl-net-r" color="#f92672" />
        <GlowFilter id="gl-net-w" color="#eee" />
      </defs>

      {/* --- エッジ --- */}
      {edges.map((e, i) => {
        const a = projected[e.from];
        const b = projected[e.to];
        const dimmed = anyHovered && !highlightedEdges.has(i);
        const avgScale = (a.scale + b.scale) / 2;
        return (
          <line
            key={`e${i}`}
            x1={a.sx}
            y1={a.sy}
            x2={b.sx}
            y2={b.sy}
            stroke={e.color}
            strokeWidth={0.8 * avgScale}
            opacity={dimmed ? 0.12 : 1}
            style={{ transition: "opacity 0.3s ease" }}
          />
        );
      })}

      {/* --- ノード --- */}
      {nodes.map((n, i) => {
        const p = projected[i];
        const isHub = i === hubIndex;
        const dimmed = anyHovered && !highlightedNodes.has(i) && !isHub;
        const isPulsing = i === pulseIndex;
        const scaledR = n.r * p.scale;

        return (
          <g key={`n${i}`}>
            {/* ベースノード */}
            <circle
              cx={p.sx}
              cy={p.sy}
              r={scaledR}
              fill={n.color}
              filter={`url(#${filterIdFor(n.color)})`}
              opacity={dimmed ? 0.25 : 1}
              style={{ transition: "opacity 0.3s ease" }}
            />

            {/* ホバー時パルスリング — 2重の波紋で "発光" を強調 */}
            {isPulsing && (
              <>
                <circle
                  className={styles.pulseRing1}
                  cx={p.sx}
                  cy={p.sy}
                  r={scaledR * 3.5}
                  fill="none"
                  stroke={n.color}
                  strokeWidth={1.5}
                  filter={`url(#${filterIdFor(n.color)})`}
                />
                <circle
                  className={styles.pulseRing2}
                  cx={p.sx}
                  cy={p.sy}
                  r={scaledR * 6}
                  fill="none"
                  stroke={n.color}
                  strokeWidth={0.6}
                />
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* ================================================== */
/*  Main export                                       */
/* ================================================== */

export default function GeometricShapes({
  variant,
  skillData,
  hoveredSkill,
}: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const isAbout = variant === "about";

  return (
    <div
      ref={ref}
      className={`${styles.container} ${isAbout ? styles.about : styles.skills}`}
    >
      {isAbout ? (
        <div className={styles.floatWrapper}>
          <ArchitectureGraphic inView={inView} />
        </div>
      ) : (
        <NetworkGraphic
          inView={inView}
          skillData={skillData}
          hoveredSkill={hoveredSkill}
        />
      )}
    </div>
  );
}
