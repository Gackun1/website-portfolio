"use client";

import { useEffect, useRef } from "react";
import styles from "./LogoVisual.module.scss";

/**
 * DustField — 背景をゆっくり上昇する "データの塵"
 *
 * ParticleLogo / PathLogo / PathLogoPlus 共通の背景レイヤー。
 * three.js に依存しないよう Canvas 2D で描画し、ParticleLogo 旧実装 (シェーダー) と
 * 同じ透視投影 (FOV 35° / カメラ z=6) で奥行きのある見た目を再現している。
 */

const CAMERA_Z = 6;
const FOV = 35;
const COLOR = "143, 163, 184"; // #8fa3b8
const FADE_IN = 1.6; // s

type Dust = { x: number; y: number; z: number; r1: number; r2: number; r3: number };

/** 柔らかい円のスプライトを一度だけ描いておき、drawImage で使い回す */
function createSprite() {
  const size = 32;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d");
  if (!ctx) return c;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, `rgba(${COLOR}, 1)`);
  g.addColorStop(0.4, `rgba(${COLOR}, 0.55)`);
  g.addColorStop(1, `rgba(${COLOR}, 0)`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return c;
}

export default function DustField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const count = window.innerWidth < 768 ? 500 : 1100;
    const dust: Dust[] = Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 14,
      y: (Math.random() - 0.5) * 10,
      z: -Math.random() * 6 + 1,
      r1: Math.random(),
      r2: Math.random(),
      r3: Math.random(),
    }));
    const sprite = createSprite();

    let w = 0;
    let h = 0;
    let dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    };

    const draw = (t: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      const focal = h / (2 * Math.tan(((FOV / 2) * Math.PI) / 180));
      const sizeBase = (h / 900) * 14 * 1.3;
      const fade = reduce ? 1 : Math.min(t / FADE_IN, 1);

      for (const d of dust) {
        // ゆっくり上昇してループ + 左右にゆらぐ
        const y = ((((d.y + t * (0.04 + d.r1 * 0.08) + 5) % 10) + 10) % 10) - 5;
        const x = d.x + Math.sin(t * 0.2 + d.r2 * Math.PI * 2) * 0.15;
        const depth = CAMERA_Z - d.z;
        const sx = w / 2 + (x * focal) / depth;
        const sy = h / 2 - (y * focal) / depth;
        const size = ((0.6 + d.r3) * sizeBase) / depth;
        if (sx < -size || sx > w + size || sy < -size || sy > h + size) continue;
        ctx.globalAlpha = (0.15 + d.r3 * 0.35) * fade;
        ctx.drawImage(sprite, sx - size / 2, sy - size / 2, size, size);
      }
    };

    resize();
    let raf = 0;
    let running = false;
    let elapsed = 0;
    let last = performance.now();

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const now = performance.now();
      elapsed += Math.min((now - last) / 1000, 0.1);
      last = now;
      draw(elapsed);
    };
    const start = () => {
      if (running || reduce) return;
      running = true;
      last = performance.now();
      tick();
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    if (reduce) draw(0);

    const io = new IntersectionObserver(([e]) => (e.isIntersecting && !document.hidden ? start() : stop()));
    io.observe(canvas);
    const ro = new ResizeObserver(() => {
      resize();
      draw(elapsed);
    });
    ro.observe(canvas);
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.dust} aria-hidden="true" />;
}
