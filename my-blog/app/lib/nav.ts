/**
 * サイト共通のナビゲーション定義 (サイドメニュー / フッター)
 * すべてページ単位のリンク。
 */
export type NavItem = {
  label: string;
  href: string;
  /** 現在地とみなすパス (配下のページも含む) */
  match: string;
};

export const navItems: NavItem[] = [
  { label: "Home", href: "/", match: "/" },
  { label: "About", href: "/about", match: "/about" },
  { label: "Works", href: "/works", match: "/works" },
  { label: "Blog", href: "/blog", match: "/blog" },
  { label: "Contact", href: "/contact", match: "/contact" },
];

export function isCurrentNav(item: NavItem, pathname: string): boolean {
  if (item.match === "/") return pathname === "/";
  return pathname === item.match || pathname.startsWith(`${item.match}/`);
}

/**
 * トップページのセクション (右側のスクロール位置インジケーター用)
 */
export const homeSections = [
  { id: "top", label: "Home" },
  { id: "about", label: "About" },
  { id: "skill", label: "Skill" },
  { id: "works", label: "Works" },
  { id: "blog", label: "Blog" },
  { id: "contact", label: "Contact" },
];

/** 同じページ内のアンカーへスムーススクロール */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: "smooth" });
}

/** SNS アカウント (サイドメニュー) */
export const snsLinks = [
  { label: "Instagram", href: "https://www.instagram.com/gaku090707/", icon: "/img/i_instagram.png" },
  { label: "X", href: "https://x.com/gakugaku_gackun", icon: "/img/i_x.svg" },
  { label: "YouTube", href: "https://www.youtube.com/@gakugackun4926", icon: "/img/i_youtube.png" },
];
