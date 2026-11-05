import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.scss";
import styles from "./layout.module.scss";
import SideMenu from "./components/SideMenu/SideMenu";
import Footer from "./components/Footer/Footer";
import ScrollProgress from "./components/ScrollProgress/ScrollProgress";
import { fontVariables } from "./lib/fonts";

const GTM_ID = "GTM-W5RBT2DZ";

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
        {/* Google Tag Manager */}
        <Script id="gtm-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag("js", new Date());
dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });`}
        </Script>
        <Script src={`https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`} strategy="afterInteractive" />
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
