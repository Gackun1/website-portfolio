import type { Metadata } from "next";
import "./globals.scss";
import styles from "./layout.module.scss";
import SideMenu from "./components/SideMenu/SideMenu";
import Footer from "./components/Footer/Footer";

export const metadata: Metadata = {
  title: "Gackun.",
  description: "Web Develop & Design Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <SideMenu />
        <div className={styles.container}>
          <div className={styles.sidebar} />
          <div className={styles.content}>
            {children}
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
