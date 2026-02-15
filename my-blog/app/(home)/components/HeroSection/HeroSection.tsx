"use client";

import { motion } from "framer-motion";
import styles from "./HeroSection.module.scss";
import AnimatedSVG from "../AnimatedSVG/AnimatedSVG";

export default function HeroSection() {
  return (
    <motion.div
      id="top"
      className={styles.cTopSection}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <h1 className={styles.cTopSectionHeading}>
        <span className={styles.uTypingSize6}>Hello,</span>
        <span className={styles.uTypingSize12}>
          I&apos;m <span className={styles.uColorRed}>Gac</span>kun.
        </span>
        <span className={styles.uTypingSize20}>Web Developer &amp; Designer.</span>
      </h1>
      <AnimatedSVG />
    </motion.div>
  );
}
