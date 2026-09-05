import { IBM_Plex_Mono, Space_Grotesk, Zen_Kaku_Gothic_New } from "next/font/google";

/**
 * Web フォント (next/font でビルド時にセルフホスト + サブセット化)
 *
 *   本文   : Zen Kaku Gothic New — 端正で現代的な和文ゴシック
 *   見出し : Space Grotesk       — 少し癖のあるグロテスク。等幅由来の形がコードの世界観と合う
 *   コード : IBM Plex Mono       — 読みやすい等幅
 *
 * それぞれ CSS 変数 (--ff-*) として html に登録し、globals.scss で役割に割り当てる。
 * 日本語フォントは unicode-range で分割配信されるため preload は切っている。
 */

const zenKaku = Zen_Kaku_Gothic_New({
  weight: ["400", "500", "700"],
  variable: "--ff-zen-kaku",
  display: "swap",
  preload: false,
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--ff-space-grotesk",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--ff-plex-mono",
  display: "swap",
});

export const fontVariables = [zenKaku, spaceGrotesk, ibmPlexMono].map((f) => f.variable).join(" ");
