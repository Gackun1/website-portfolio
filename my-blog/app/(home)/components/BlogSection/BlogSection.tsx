"use client";

import ScrollReveal from "../../../components/motion/ScrollReveal";
import StaggerContainer from "../../../components/motion/StaggerContainer";
import StaggerItem from "../../../components/motion/StaggerItem";
import SectionHeading from "../../../components/SectionHeading/SectionHeading";
import TerminalButton from "../../../components/TerminalButton/TerminalButton";
import styles from "./BlogSection.module.scss";

type BlogPost = {
  image: string;
  title: string;
  date: string;
  href: string;
};

const blogPosts: BlogPost[] = [
  { image: "/img/i_html.svg", title: "正しいタグを使用してセマンティクスなHTMLを書く", date: "2022/02/01", href: "#" },
  { image: "/img/i_js.svg", title: "ES6を使いこなす 後編", date: "2022/02/01", href: "#" },
  { image: "/img/i_js.svg", title: "ES6を使いこなす 前編", date: "2022/02/01", href: "#" },
  { image: "/img/i_react.svg", title: "Reactのクラスコンポーネントを関数コンポーネントへ", date: "2022/02/01", href: "#" },
  { image: "/img/i_design.svg", title: "フロントエンドエンジニアとしてのUX 後編", date: "2022/02/01", href: "#" },
  { image: "/img/i_design.svg", title: "フロントエンドエンジニアとしてのUX 前編", date: "2022/02/01", href: "#" },
];

export default function BlogSection() {
  return (
    <section id="blog" className={styles.cSection}>
      <ScrollReveal>
        <SectionHeading name="blog" args="'desc'" />
        <div className={styles.cSectionDescription}>
          私の技術ブログです。
          <br />
          主にWEBのフロントエンド開発についての記事を書いています。
        </div>
      </ScrollReveal>

      <StaggerContainer className={styles.cBlog} staggerDelay={0.1}>
        {blogPosts.map((post, index) => (
          <StaggerItem key={index}>
            <a href={post.href}>
              <article className={styles.cBlogItem}>
                <div className={styles.cBlogImg}>
                  <img src={post.image} alt="" />
                </div>
                <div className={styles.cBlogText}>
                  <h3 className={styles.cBlogHeading}>{post.title}</h3>
                  <span className={styles.cBlogDate}>{post.date}</span>
                </div>
              </article>
            </a>
          </StaggerItem>
        ))}
      </StaggerContainer>

      <ScrollReveal>
        <TerminalButton label="もっと見る" />
      </ScrollReveal>
    </section>
  );
}
