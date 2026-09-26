"use client";

import Link from "next/link";
import StaggerContainer from "../motion/StaggerContainer";
import StaggerItem from "../motion/StaggerItem";
import type { PostMeta } from "../../lib/blog";
import styles from "./PostList.module.scss";

type Props = {
  posts: PostMeta[];
};

/** ブログ記事の罫線リスト (トップ / 一覧ページ共通) */
export default function PostList({ posts }: Props) {
  return (
    <StaggerContainer className={styles.list} staggerDelay={0.08}>
      {posts.map((post) => (
        <StaggerItem key={post.slug}>
          <Link href={`/blog/${post.slug}`} className={styles.row}>
            <span className={styles.icon}>
              <img src={post.image} alt="" />
            </span>
            <span className={styles.body}>
              <span className={styles.title}>{post.title}</span>
              {post.description && <span className={styles.excerpt}>{post.description}</span>}
            </span>
            <time className={styles.date} dateTime={post.date}>
              {post.date.replaceAll("-", ".")}
            </time>
            <span className={styles.arrow} aria-hidden="true">
              →
            </span>
          </Link>
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}
