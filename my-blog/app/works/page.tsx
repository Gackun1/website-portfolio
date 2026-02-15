import { getAllWorks } from "../lib/works";
import SectionHeading from "../components/SectionHeading/SectionHeading";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import WorksGrid from "./WorksGrid";
import styles from "./page.module.scss";

export const metadata = {
  title: "Works - Gackun.",
};

export default function WorksArchive() {
  const works = getAllWorks();

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <Breadcrumb items={[{ label: "Works" }]} />
        <SectionHeading name="works" args="'all'" />
        <p className={styles.description}>
          私の制作実績です。
          <br />
          サムネイルをクリックすると全体を確認できます。
        </p>
      </div>
      <WorksGrid works={works} />
    </main>
  );
}
