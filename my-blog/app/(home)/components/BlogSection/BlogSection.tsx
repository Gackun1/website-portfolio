"use client";

import PostList from "../../../components/PostList/PostList";
import ScrollReveal from "../../../components/motion/ScrollReveal";
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
      <SectionHeading name="blog" args="'desc'" index="04" label="Writing" />
      <ScrollReveal>
        <p className={styles.description}>
          フロントエンド開発を中心に、学んだことや実務の知見をまとめている技術ブログです。
        </p>
      </ScrollReveal>

      <PostList posts={posts} />

      <ScrollReveal>
        <TerminalButton label="記事一覧を見る" href="/blog" />
      </ScrollReveal>
    </section>
  );
}
