import Link from "next/link";
import { getPostBySlug, getPostSlugs } from "../../lib/blog";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import styles from "./page.module.scss";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  return { title: `${post.title} - Gackun.` };
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  return (
    <main className={styles.page}>
      <Breadcrumb
        items={[
          { label: "Blog", href: "/blog" },
          { label: post.title },
        ]}
      />

      <article className={styles.article}>
        <div className={styles.meta}>
          <div className={styles.image}>
            <img src={post.image} alt="" />
          </div>
          <div>
            <h1 className={styles.title}>{post.title}</h1>
            <time className={styles.date}>{post.date}</time>
          </div>
        </div>

        <div
          className={styles.prose}
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
      </article>

      <Link href="/blog" className={styles.back}>
        &larr; 一覧に戻る
      </Link>
    </main>
  );
}
