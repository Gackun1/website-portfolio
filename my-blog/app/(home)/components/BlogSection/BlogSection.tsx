"use client";

import Link from "next/link";
import ScrollReveal from "../../../components/motion/ScrollReveal";
import StaggerContainer from "../../../components/motion/StaggerContainer";
import StaggerItem from "../../../components/motion/StaggerItem";
import SectionHeading from "../../../components/SectionHeading/SectionHeading";
import TerminalButton from "../../../components/TerminalButton/TerminalButton";
import type { PostMeta } from "../../../lib/blog";
import styles from "./BlogSection.module.scss";

type Props = {
  posts: PostMeta[];
};

export default function BlogSection({ posts }: Props) {
  return (
    <section id="blog" className={styles.section}>
      <ScrollReveal>
        <SectionHeading name="blog" args="'desc'" />
        <div className={styles.description}>
          私の技術ブログです。
          <br />
          主にWEBのフロントエンド開発についての記事を書いています。
        </div>
      </ScrollReveal>

      <StaggerContainer className={styles.grid} staggerDelay={0.1}>
        {posts.map((post) => (
          <StaggerItem key={post.slug}>
            <Link href={`/blog/${post.slug}`}>
              <article className={styles.item}>
                <div className={styles.image}>
                  <img src={post.image} alt="" />
                </div>
                <div className={styles.body}>
                  <h3 className={styles.title}>{post.title}</h3>
                  <span className={styles.date}>{post.date}</span>
                </div>
              </article>
            </Link>
          </StaggerItem>
        ))}
      </StaggerContainer>

      <ScrollReveal>
        <TerminalButton label="もっと見る" href="/blog" />
      </ScrollReveal>
    </section>
  );
}
