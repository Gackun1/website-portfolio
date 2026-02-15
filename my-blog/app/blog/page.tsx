import Link from "next/link";
import { getAllPosts } from "../lib/blog";
import SectionHeading from "../components/SectionHeading/SectionHeading";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import styles from "./page.module.scss";

export const metadata = {
  title: "Blog - Gackun.",
};

export default function BlogArchive() {
  const posts = getAllPosts();

  return (
    <main className={styles.page}>
      <Breadcrumb items={[{ label: "Blog" }]} />
      <SectionHeading name="blog" args="'all'" />
      <p className={styles.description}>
        私の技術ブログです。
        <br />
        主にWEBのフロントエンド開発についての記事を書いています。
      </p>

      <div className={styles.grid}>
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className={styles.link}>
            <article className={styles.item}>
              <div className={styles.image}>
                <img src={post.image} alt="" />
              </div>
              <div className={styles.body}>
                <h3 className={styles.title}>{post.title}</h3>
                <p className={styles.desc}>{post.description}</p>
                <span className={styles.date}>{post.date}</span>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </main>
  );
}
