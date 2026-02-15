"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ScrollReveal from "../../../components/motion/ScrollReveal";
import SectionHeading from "../../../components/SectionHeading/SectionHeading";
import TerminalButton from "../../../components/TerminalButton/TerminalButton";
import styles from "./ContactSection.module.scss";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    inquiryType: "",
    name: "",
    content: "",
  });
  const [formResult, setFormResult] = useState("");

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.inquiryType && formData.name && formData.content) {
      setFormResult("success");
    } else {
      setFormResult("error");
    }
  };

  return (
    <section id="contact" className={styles.section}>
      <ScrollReveal>
        <SectionHeading name="contact" args="message" />
        <div className={styles.description}>
          制作のご依頼、ご相談などはこちらのフォームからお気軽にお問い合わせください。
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.2}>
        <div className={styles.grid}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formItem}>
              <label htmlFor="inquiry_type" className={styles.formLabel}>
                <span className={styles.terminalPrefix}>$ </span>
                お問い合わせ目的
              </label>
              <select
                name="inquiry_type"
                id="inquiry_type"
                value={formData.inquiryType}
                onChange={(e) => handleInputChange("inquiryType", e.target.value)}
              >
                <option value="">- 選択してください -</option>
                <option value="works">制作のご依頼</option>
                <option value="consultation">お見積もり・ご相談</option>
                <option value="other">その他</option>
              </select>
            </div>
            <div className={styles.formItem}>
              <label htmlFor="name" className={styles.formLabel}>
                <span className={styles.terminalPrefix}>$ </span>
                お名前
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </div>
            <div className={styles.formItem}>
              <label htmlFor="content" className={styles.formLabel}>
                <span className={styles.terminalPrefix}>$ </span>
                お問い合わせ内容
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={(e) => handleInputChange("content", e.target.value)}
              ></textarea>
            </div>
            <TerminalButton label="送信する" type="submit" />
          </form>
          <div className={styles.terminal}>
            <div className={styles.terminalDots}>
              <span className={styles.dotRed} />
              <span className={styles.dotYellow} />
              <span className={styles.dotGreen} />
            </div>
            <div className={styles.terminalContent}>
              <span className={styles.blue}>const</span> message{" "}
              <span className={styles.red}>=</span>{" "}
              <span className={styles.yellow}>{"{"}</span>
              <br />
              <div className={styles.terminalRow}>
                inquaryType:{" "}
                <span className={styles.yellow}>
                  &apos;{formData.inquiryType}&apos;
                </span>
                ,
              </div>
              <div className={styles.terminalRow}>
                userName:{" "}
                <span className={styles.yellow}>
                  &apos;{formData.name}&apos;
                </span>
                ,
              </div>
              <div className={styles.terminalRow}>
                body:{" "}
                <span className={styles.yellow}>
                  &apos;{formData.content}&apos;
                </span>
              </div>
              <span className={styles.yellow}>{"}"}</span>
              <br />
              <br />
              gackun<span className={styles.green}>.contact</span>
              <span className={styles.yellow}>(</span>message
              <span className={styles.yellow}>)</span>
              <br />
              <br />
              &gt;{" "}
              <AnimatePresence mode="wait">
                {formResult === "success" && (
                  <motion.span
                    key="success"
                    className={styles.green}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    success!
                  </motion.span>
                )}
                {formResult === "error" && (
                  <motion.span
                    key="error"
                    className={styles.red}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    error! Please enter all of the items.
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
