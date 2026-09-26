import { getAllWorks } from "../lib/works";
import SectionHeading from "../components/SectionHeading/SectionHeading";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import WorksBento from "../components/WorksBento/WorksBento";
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
          これまでに手がけたサイト・デザインの実績です。
          <br />
          サムネイルを選択すると、ページ全体のデザインをご覧いただけます。
        </p>
      </div>
      <WorksBento works={works} />
    </main>
  );
}
