"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import styles from "./ScrollProgress.module.scss";

/** ページ全体の読了率 — デスクトップはサイドバー右端の縦線、モバイルは上端の横線 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  return (
    <>
      <motion.div className={styles.vertical} style={{ scaleY: progress }} aria-hidden="true" />
      <motion.div className={styles.horizontal} style={{ scaleX: progress }} aria-hidden="true" />
    </>
  );
}
