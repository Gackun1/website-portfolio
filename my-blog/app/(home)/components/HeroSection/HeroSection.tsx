"use client";

import { motion } from "framer-motion";
import styles from "./HeroSection.module.scss";
import AnimatedSVG from "../AnimatedSVG/AnimatedSVG";

export default function HeroSection() {
  return (
    <motion.div
      id="top"
      className={styles.section}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <h1 className={styles.heading}>
        <span className={styles.typingLine1}>Hello,</span>
        <span className={styles.typingLine2}>
          I&apos;m <span className={styles.red}>Gac</span>kun.
        </span>
        <span className={styles.typingLine3}>Web Developer &amp; Designer.</span>
      </h1>
      <AnimatedSVG />
    </motion.div>
  );
}
