import { getAllPosts } from "../lib/blog";
import SectionHeading from "../components/SectionHeading/SectionHeading";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import PostList from "../components/PostList/PostList";
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
        フロントエンド開発を中心に、学んだことや実務の知見をまとめている技術ブログです。
      </p>

      <PostList posts={posts} />
    </main>
  );
}
