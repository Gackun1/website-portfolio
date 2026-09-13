"use client";

import { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import DustField from "./DustField";
import PathLogo from "./PathLogo";
import styles from "./LogoVisual.module.scss";

// three.js (≈150kB) は初期 JS から切り離し、描画後に遅延読み込みする
const ParticleScene = dynamic(() => import("./ParticleScene"), { ssr: false });

/**
 * ParticleLogo — 散らばった粒子がロゴへ収束する WebGL 版 MV
 * WebGL が使えない環境では自動的に PathLogo へ切り替わる。
 *
 * 使い方: position: relative な親の中に置くだけ
 *   <ParticleLogo />              背景の塵あり (デフォルト)
 *   <ParticleLogo dust={false} /> 背景の塵なし
 */

interface Props {
  /** 背景の塵パーティクルを表示する */
  dust?: boolean;
}

export default function ParticleLogo({ dust = true }: Props) {
  const [fallback, setFallback] = useState(false);
  const handleFallback = useCallback(() => setFallback(true), []);

  if (fallback) return <PathLogo dust={dust} />;

  return (
    <div className={styles.root} aria-hidden="true">
      {dust && <DustField />}
      <ParticleScene onFallback={handleFallback} />
    </div>
  );
}
