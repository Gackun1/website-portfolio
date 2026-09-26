"use client";

import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import styles from "./Marquee.module.scss";

/**
 * Marquee — スクロール速度に反応して流れるテキスト帯
 * 通常はゆっくり流れ、スクロールすると加速・向きが反転する。
 * セクションの区切りに "動く余白" をつくるための装飾。
 */

const COPIES = 4;

function wrap(min: number, max: number, v: number) {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
}

interface Props {
  items: string[];
  /** 1秒あたりの移動量 (%)。負で左向き */
  baseVelocity?: number;
}

export default function Marquee({ items, baseVelocity = -2 }: Props) {
  const reduce = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 4], { clamp: false });
  const x = useTransform(baseX, (v) => `${wrap(-100 / COPIES, 0, v)}%`);
  const direction = useRef(1);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    let moveBy = direction.current * baseVelocity * (delta / 1000);
    const f = velocityFactor.get();
    if (f < 0) direction.current = -1;
    else if (f > 0) direction.current = 1;
    moveBy += direction.current * moveBy * f;
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className={styles.marquee} aria-hidden="true">
      <motion.div className={styles.track} style={{ x }}>
        {Array.from({ length: COPIES }).map((_, copy) => (
          <span key={copy} className={styles.group}>
            {items.map((item, i) => (
              <span key={i} className={styles.item}>
                <span className={i % 2 === 0 ? styles.outline : styles.solid}>{item}</span>
                <span className={styles.sep}>/</span>
              </span>
            ))}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
