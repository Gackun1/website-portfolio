import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import AboutSection from "../(home)/components/AboutSection/AboutSection";
import SkillsSection from "../(home)/components/SkillsSection/SkillsSection";
import styles from "./page.module.scss";

export const metadata = {
  title: "About - Gackun.",
};

/** About + Skills をまとめたプロフィールページ (トップと同じセクションを再利用) */
export default function AboutPage() {
  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <Breadcrumb items={[{ label: "About" }]} />
      </div>
      <AboutSection />
      <SkillsSection />
    </main>
  );
}
