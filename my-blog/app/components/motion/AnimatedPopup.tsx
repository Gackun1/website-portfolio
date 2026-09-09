"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./AnimatedPopup.module.scss";

interface AnimatedPopupProps {
  isOpen: boolean;
  onClose: () => void;
  /** ヘッダーに表示するタイトル (スクリーンリーダーのラベルも兼ねる) */
  title?: string;
  /** タイトル横の補足 (カテゴリなど) */
  meta?: string;
  children: React.ReactNode;
}

const ease = [0.22, 1, 0.36, 1] as const;

export default function AnimatedPopup({ isOpen, onClose, title, meta, children }: AnimatedPopupProps) {
  // コンテンツ列の stacking context (z-index:1) から抜け出し、サイドバーより前面に出すため body 直下へ portal
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Esc で閉じる + 背面スクロールを止める
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.backdrop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        >
          <motion.div
            className={styles.window}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.5, ease }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.bar}>
              <span className={styles.dots} aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
              {title && (
                <span className={styles.title}>
                  {title}
                  {meta && <span className={styles.meta}> — {meta}</span>}
                </span>
              )}
              <button type="button" className={styles.close} onClick={onClose} autoFocus>
                esc <span aria-hidden="true">✕</span>
                <span className={styles.srOnly}>閉じる</span>
              </button>
            </div>
            <div className={styles.body}>{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
