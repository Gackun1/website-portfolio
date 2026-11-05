import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import ContactSection from "../(home)/components/ContactSection/ContactSection";
import styles from "../about/page.module.scss";

export const metadata = {
  title: "Contact - Gackun.",
};

/** お問い合わせページ (トップと同じフォームを再利用) */
export default function ContactPage() {
  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <Breadcrumb items={[{ label: "Contact" }]} />
      </div>
      <ContactSection />
    </main>
  );
}
