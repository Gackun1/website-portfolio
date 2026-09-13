"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { LOGO_PATHS, LOGO_RING, LOGO_VIEWBOX } from "../../lib/logoPaths";
import styles from "./LogoVisual.module.scss";

/**
 * ParticleScene — ロゴを構成するパーティクルの WebGL シーン (ParticleLogo の中身)
 *
 * ■ コンセプト
 *   「散らばったコードの粒子が集まり、ひとつの形（＝プロダクト）になる」
 *   旧 AnimatedSVG のストローク描画→グローの流れを、粒子の収束として再解釈。
 *
 * ■ 演出
 *   1. Intro   : 空間に散った粒子が渦を巻きながらロゴへ収束 (≈3.5s)
 *   2. Idle    : 粒子が呼吸するように揺らぎ、ランダムに瞬く
 *   3. Pointer : カーソル周辺の粒子が押し出され、発光する
 *   4. Scroll  : スクロールに合わせてロゴが解体され、奥へ散っていく
 *
 * ■ パフォーマンス
 *   ・頂点シェーダーで全アニメーションを計算（CPU は uniform 更新のみ）
 *   ・画面外 / タブ非表示時は描画停止、DPR は最大 2
 *   ・prefers-reduced-motion 時は完成形を静止描画
 */

const COLORS = {
  blue: new THREE.Color("#66d9ef"),
  green: new THREE.Color("#a6e22e"),
  red: new THREE.Color("#f92672"),
  yellow: new THREE.Color("#e6db74"),
  white: new THREE.Color("#ffffff"),
};

const CAMERA_Z = 6;
const FOV = 35;

/* -------------------------------------------------- */
/*  ロゴ形状のサンプリング                              */
/*  Path2D をオフスクリーン canvas に描き、塗り領域と     */
/*  輪郭線のピクセルから粒子の目標座標を拾う。            */
/*  さらに輪郭をぼかした "近接マップ" を作り、            */
/*  縁ほど明るく内側ほど暗い ネオン管の陰影 を与える。     */
/* -------------------------------------------------- */
function rasterize(size: number, draw: (ctx: CanvasRenderingContext2D) => void) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return new Uint8ClampedArray(size * size);
  const s = size / LOGO_VIEWBOX;
  ctx.setTransform(s, 0, 0, s, 0, 0);
  ctx.fillStyle = ctx.strokeStyle = "#fff";
  draw(ctx);

  const rgba = ctx.getImageData(0, 0, size, size).data;
  const alpha = new Uint8ClampedArray(size * size);
  for (let i = 0; i < alpha.length; i++) alpha[i] = rgba[i * 4 + 3];
  return alpha;
}

function opaquePixels(alpha: Uint8ClampedArray) {
  const pixels: number[] = [];
  for (let i = 0; i < alpha.length; i++) if (alpha[i] > 128) pixels.push(i);
  return pixels;
}

function pickPoints(pixels: number[], count: number, size: number) {
  const xy = new Float32Array(count * 2);
  const idx = new Uint32Array(count);
  for (let i = 0; i < count; i++) {
    const p = pixels[Math.floor(Math.random() * pixels.length)];
    idx[i] = p;
    // 外周リングの中心を原点、1 = viewBox 一辺 の正規化座標 (y は上向き)
    xy[i * 2] = ((p % size) + Math.random()) / size - LOGO_RING.cx / LOGO_VIEWBOX;
    xy[i * 2 + 1] = -((Math.floor(p / size) + Math.random()) / size - LOGO_RING.cy / LOGO_VIEWBOX);
  }
  return { xy, idx };
}

function pickColor(): THREE.Color {
  const r = Math.random();
  if (r < 0.07) return COLORS.green;
  if (r < 0.13) return COLORS.red;
  if (r < 0.18) return COLORS.yellow;
  return COLORS.blue;
}

/* -------------------------------------------------- */
/*  Shaders                                           */
/* -------------------------------------------------- */
const logoVertex = /* glsl */ `
  uniform float uTime;
  uniform float uProgress;
  uniform float uScatter;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform vec2 uMouse;
  uniform float uMouseStrength;
  uniform float uFlash;

  attribute vec3 aStart;
  attribute vec3 aRandom;
  attribute vec3 aColor;
  attribute float aSize;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    // 粒子ごとに到着タイミングをずらす
    float delay = aRandom.x * 0.45;
    float t = clamp((uProgress - delay) / 0.55, 0.0, 1.0);
    float e = 1.0 - pow(1.0 - t, 3.0);

    float ph = aRandom.y * 6.2831;
    vec3 target = position;
    target.z += sin(uTime * 0.9 + ph) * 0.012;
    target.xy += vec2(sin(uTime * 0.7 + ph), cos(uTime * 0.6 + ph * 1.3)) * 0.0035;

    vec3 p = mix(aStart, target, e);

    // 収束中のみ渦を巻く
    float swirl = (1.0 - e) * 2.4 * (aRandom.z + 0.3);
    float cs = cos(swirl);
    float sn = sin(swirl);
    p.xy = mat2(cs, -sn, sn, cs) * p.xy;

    // ポインター: 押し出し + 手前に浮かせる
    vec2 d = p.xy - uMouse;
    float dist = length(d);
    float f = (1.0 - smoothstep(0.0, 0.2, dist)) * uMouseStrength * e;
    p.xy += normalize(d + 1e-5) * f * 0.07;
    p.z += f * 0.18;

    // スクロール: 外側・奥へ解体
    vec3 dir = normalize(aStart);
    p += dir * uScatter * (0.5 + aRandom.x * 1.6);
    p.z -= uScatter * aRandom.y * 1.5;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uSize * uPixelRatio * (1.0 + f * 1.4) / -mv.z;

    float twinkle = 0.72 + 0.28 * sin(uTime * 2.2 + ph * 3.0);
    // 完成の瞬間に一度だけ走る閃光
    vColor = aColor * (1.0 + uFlash * 1.6) + f * 0.5;
    vAlpha = mix(0.12, 1.0, e) * twinkle * (1.0 - uScatter * 0.8);
  }
`;

const pointFragment = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = pow(smoothstep(0.5, 0.0, d), 1.6);
    gl_FragColor = vec4(vColor, a * vAlpha);
  }
`;

/* -------------------------------------------------- */
/*  Component                                         */
/* -------------------------------------------------- */
type Props = {
  /** WebGL が使えない環境で SVG 版に切り替えるためのコールバック */
  onFallback: () => void;
};

export default function ParticleScene({ onFallback }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" });
    } catch {
      onFallback();
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isSmall = window.innerWidth < 768;
    const pixelRatio = Math.min(window.devicePixelRatio, 2);

    renderer.setPixelRatio(pixelRatio);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 50);
    camera.position.z = CAMERA_Z;

    /* ---------- Logo particles ---------- */
    const SAMPLE_SIZE = 512;
    const paths = LOGO_PATHS.map((d) => new Path2D(d));
    const fillAlpha = rasterize(SAMPLE_SIZE, (ctx) => paths.forEach((p) => ctx.fill(p)));
    const edgeAlpha = rasterize(SAMPLE_SIZE, (ctx) => {
      ctx.lineWidth = 2.2;
      paths.forEach((p) => ctx.stroke(p));
    });
    // 輪郭からの近さ (0-255)
    const glowAlpha = rasterize(SAMPLE_SIZE, (ctx) => {
      ctx.filter = "blur(9px)";
      ctx.lineWidth = 6;
      paths.forEach((p) => ctx.stroke(p));
    });

    const fillCount = isSmall ? 5200 : 10000;
    const edgeCount = isSmall ? 2200 : 4200;
    const total = fillCount + edgeCount;
    const fillSample = pickPoints(opaquePixels(fillAlpha), fillCount, SAMPLE_SIZE);
    const edgeSample = pickPoints(opaquePixels(edgeAlpha), edgeCount, SAMPLE_SIZE);
    const fillPts = fillSample.xy;
    const edgePts = edgeSample.xy;

    const positions = new Float32Array(total * 3);
    const starts = new Float32Array(total * 3);
    const randoms = new Float32Array(total * 3);
    const colors = new Float32Array(total * 3);
    const sizes = new Float32Array(total);
    const tmp = new THREE.Color();

    for (let i = 0; i < total; i++) {
      const isEdge = i >= fillCount;
      const src = isEdge ? edgePts : fillPts;
      const j = isEdge ? i - fillCount : i;

      positions[i * 3] = src[j * 2];
      positions[i * 3 + 1] = src[j * 2 + 1];
      positions[i * 3 + 2] = isEdge ? 0 : (Math.random() - 0.5) * 0.06;

      // 開始位置: ロゴ周囲の球殻にランダム配置
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.6 + Math.random() * 2.6;
      starts[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starts[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starts[i * 3 + 2] = r * Math.cos(phi);

      randoms[i * 3] = Math.random();
      randoms[i * 3 + 1] = Math.random();
      randoms[i * 3 + 2] = Math.random();

      if (isEdge) {
        // 輪郭: 白寄りの青で形をシャープに見せる
        tmp.copy(COLORS.blue).lerp(COLORS.white, 0.35 + Math.random() * 0.3);
        sizes[i] = 1.5 + Math.random() * 0.9;
      } else {
        // 縁に近いほど明るく、内側は暗く沈ませて立体感を出す
        const prox = Math.min(glowAlpha[fillSample.idx[j]] / 160, 1);
        tmp.copy(pickColor()).multiplyScalar(0.2 + prox * 0.85 + Math.random() * 0.2);
        sizes[i] = 0.8 + Math.random() * 1.2 + prox * 0.4;
      }
      colors[i * 3] = tmp.r;
      colors[i * 3 + 1] = tmp.g;
      colors[i * 3 + 2] = tmp.b;
    }

    const logoGeo = new THREE.BufferGeometry();
    logoGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    logoGeo.setAttribute("aStart", new THREE.BufferAttribute(starts, 3));
    logoGeo.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 3));
    logoGeo.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
    logoGeo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));

    const logoUniforms = {
      uTime: { value: 0 },
      uProgress: { value: reduceMotion ? 1 : 0 },
      uScatter: { value: 0 },
      uSize: { value: 10 },
      uPixelRatio: { value: pixelRatio },
      uMouse: { value: new THREE.Vector2(9, 9) },
      uMouseStrength: { value: 0 },
      uFlash: { value: 0 },
    };
    const logoMat = new THREE.ShaderMaterial({
      vertexShader: logoVertex,
      fragmentShader: pointFragment,
      uniforms: logoUniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const logo = new THREE.Points(logoGeo, logoMat);
    const logoGroup = new THREE.Group();
    logoGroup.add(logo);
    scene.add(logoGroup);

    /* ---------- Layout ---------- */
    let logoScale = 1;
    const layout = () => {
      const { clientWidth: w, clientHeight: h } = container;
      if (!w || !h) return;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();

      const visH = 2 * Math.tan(THREE.MathUtils.degToRad(FOV / 2)) * CAMERA_Z;
      const visW = visH * camera.aspect;

      if (camera.aspect > 1.1) {
        // デスクトップ: 右側に大きく、見出しと対角でバランスを取る
        logoScale = Math.min(visH * 0.82, visW * 0.5);
        logoGroup.position.set(visW / 2 - logoScale / 2 - visW * 0.05, visH * 0.02, 0);
      } else {
        // モバイル / 縦長: 上部中央、見出しの背後
        logoScale = Math.min(visW * 0.82, visH * 0.55);
        logoGroup.position.set(0, visH * 0.13, 0);
      }
      logoGroup.scale.setScalar(logoScale);

      // 粒子サイズは表示高に比例させ、解像度に依らず同じ密度感にする
      const sizeBase = (h / 900) * 14;
      logoUniforms.uSize.value = sizeBase;
    };

    /* ---------- Pointer ---------- */
    const pointerNdc = new THREE.Vector2(0, 0);
    const pointerLocal = new THREE.Vector2(9, 9);
    let pointerActive = false;
    const ray = new THREE.Vector3();

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const inside = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
      pointerActive = inside && e.pointerType === "mouse";
      pointerNdc.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);

      // NDC → z=0 平面 → ロゴのローカル座標
      ray.set(pointerNdc.x, pointerNdc.y, 0.5).unproject(camera).sub(camera.position).normalize();
      const dist = -camera.position.z / ray.z;
      const wx = camera.position.x + ray.x * dist;
      const wy = camera.position.y + ray.y * dist;
      pointerLocal.set((wx - logoGroup.position.x) / logoScale, (wy - logoGroup.position.y) / logoScale);
    };
    const onPointerLeave = () => (pointerActive = false);

    /* ---------- Loop ---------- */
    // 停止中は時間を進めない (再表示時にイントロが飛ばないように)
    let last = performance.now();
    let elapsed = 0;
    let raf = 0;
    let running = false;
    const INTRO_DELAY = 0.25;
    const INTRO_DURATION = 3.6;

    const render = () => renderer.render(scene, camera);

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const now = performance.now();
      elapsed += Math.min((now - last) / 1000, 0.1);
      last = now;
      const t = elapsed;
      const introT = Math.min(Math.max((t - INTRO_DELAY) / INTRO_DURATION, 0), 1);

      logoUniforms.uTime.value = t;
      logoUniforms.uProgress.value = introT;
      const sinceDone = t - INTRO_DELAY - INTRO_DURATION * 0.92;
      logoUniforms.uFlash.value = sinceDone > 0 ? Math.exp(-sinceDone * 4) : 0;

      // ポインター追従 (慣性)
      const m = logoUniforms.uMouse.value;
      m.lerp(pointerLocal, 0.12);
      logoUniforms.uMouseStrength.value += ((pointerActive ? 1 : 0) - logoUniforms.uMouseStrength.value) * 0.06;

      // カメラ方向へのわずかな傾き
      logoGroup.rotation.y += (pointerNdc.x * 0.16 - logoGroup.rotation.y) * 0.04;
      logoGroup.rotation.x += (-pointerNdc.y * 0.1 - logoGroup.rotation.x) * 0.04;

      // スクロール量で解体
      const hh = container.clientHeight || 1;
      const scatter = Math.min(Math.max(window.scrollY / (hh * 0.85), 0), 1);
      logoUniforms.uScatter.value += (scatter - logoUniforms.uScatter.value) * 0.1;

      render();
    };

    const start = () => {
      if (running || reduceMotion) return;
      running = true;
      last = performance.now(); // 停止期間分の時間を捨てる
      tick();
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    layout();
    if (reduceMotion) render();

    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting && !document.hidden ? start() : stop()), {
      threshold: 0,
    });
    io.observe(container);

    const onVisibility = () => (document.hidden ? stop() : start());
    const onResize = () => {
      layout();
      if (reduceMotion) render();
    };

    const ro = new ResizeObserver(onResize);
    ro.observe(container);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      logoGeo.dispose();
      logoMat.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [onFallback]);

  return <div ref={containerRef} className={styles.canvas} aria-hidden="true" />;
}
