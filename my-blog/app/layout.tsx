import type { Metadata, Viewport } from "next";
import "./globals.scss";
import styles from "./layout.module.scss";
import SideMenu from "./components/SideMenu/SideMenu";
import Footer from "./components/Footer/Footer";
import ScrollProgress from "./components/ScrollProgress/ScrollProgress";
import { fontVariables } from "./lib/fonts";

export const metadata: Metadata = {
  title: "Gackun. — Frontend Developer & Designer",
  description: "東京を拠点に活動するフロントエンド開発者・デザイナー Gackun のポートフォリオ。ウェブサイトのデザインと実装、WordPress テーマ開発、SEO、モーションを手がけています。",
};

export const viewport: Viewport = {
  themeColor: "#181818",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={fontVariables}>
      <body>
        <SideMenu />
        <ScrollProgress />
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
