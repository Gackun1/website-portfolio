"use client";

import { motion } from "framer-motion";
import styles from "./SectionHeading.module.scss";

interface SectionHeadingProps {
  name: string;
  args?: string;
  /** セクション番号 ("01" など)。指定するとメタ行を表示 */
  index?: string;
  /** メタ行に添える補足ラベル */
  label?: string;
}

const ease = [0.22, 1, 0.36, 1] as const;

export default function SectionHeading({ name, args = "", index, label }: SectionHeadingProps) {
  return (
    <motion.div
      className={styles.wrap}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
    >
      {index && (
        <div className={styles.meta}>
          <motion.span
            className={styles.index}
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.6 } } }}
          >
            {index}
          </motion.span>
          <motion.span
            className={styles.rule}
            variants={{
              hidden: { scaleX: 0 },
              visible: { scaleX: 1, transition: { duration: 1, ease, delay: 0.1 } },
            }}
          />
          {label && (
            <motion.span
              className={styles.label}
              variants={{ hidden: { opacity: 0, x: -8 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay: 0.5 } } }}
            >
              {label}
            </motion.span>
          )}
        </div>
      )}
      <h2 className={styles.heading}>
        <motion.span
          className={styles.inner}
          variants={{
            hidden: { y: "105%" },
            visible: { y: "0%", transition: { duration: 0.9, ease, delay: 0.15 } },
          }}
        >
          <span className={styles.prompt}>&gt;</span>
          <span className={styles.green}>.{name}</span>
          <span className={styles.yellow}>(</span>
          {/* 文字列リテラルは Monokai の文字列色、識別子は白 */}
          {args && <span className={args.startsWith("'") ? styles.string : styles.ident}>{args}</span>}
          <span className={styles.yellow}>)</span>
        </motion.span>
      </h2>
    </motion.div>
  );
}
