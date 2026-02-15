---
title: "フロントエンドエンジニアとしてのUX 後編"
date: "2022-02-01"
image: "/img/i_design.svg"
description: "アニメーション、アクセシビリティ、レスポンシブデザインなど、UXを向上させる実装テクニックを紹介します。"
---

## はじめに

前編ではパフォーマンスやフォームのUXについて解説しました。後編では、アニメーション、アクセシビリティ、レスポンシブデザインに焦点を当て、実装レベルでUXを向上させるテクニックを紹介します。

## アニメーションとマイクロインタラクション

適切なアニメーションは、ユーザーの操作に対するフィードバックを提供し、UIの状態変化を分かりやすく伝えます。

### トランジションの基本原則

```css
/* 良いトランジション: 自然で控えめ */
.button {
  transition: transform 0.2s ease, background-color 0.2s ease;
}

.button:hover {
  transform: translateY(-2px);
}

.button:active {
  transform: translateY(0);
}
```

### アニメーションのパフォーマンス

GPUアクセラレーションが効くプロパティを使いましょう。

```css
/* 良い: transform と opacity */
.slide-in {
  transform: translateX(-100%);
  opacity: 0;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-in.active {
  transform: translateX(0);
  opacity: 1;
}

/* 避ける: width, height, top, left */
```

### prefers-reduced-motion の対応

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## アクセシビリティ (a11y)

### キーボードナビゲーション

```jsx
function Dropdown({ items }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const handleKeyDown = (e) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) => Math.min(prev + 1, items.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) => Math.max(prev - 1, 0));
        break;
      case "Escape":
        setIsOpen(false);
        break;
    }
  };

  return (
    <div role="listbox" onKeyDown={handleKeyDown}>
      {items.map((item, i) => (
        <div
          key={i}
          role="option"
          aria-selected={i === activeIndex}
        >
          {item}
        </div>
      ))}
    </div>
  );
}
```

### カラーコントラスト

WCAG 2.1では、テキストと背景のコントラスト比が **4.5:1以上** であることを推奨しています。

```css
/* コントラスト比が十分な組み合わせ */
.text-primary {
  color: #333333;       /* 暗い背景: 12.63:1 */
  background: #ffffff;
}

.text-on-dark {
  color: #e0e0e0;       /* 暗い背景: 10.26:1 */
  background: #1a1a1a;
}
```

## レスポンシブデザイン

### モバイルファーストのアプローチ

```css
/* ベース: モバイル */
.container {
  padding: 16px;
}

.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

/* タブレット以上 */
@media (min-width: 768px) {
  .container {
    padding: 32px;
  }

  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* デスクトップ以上 */
@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### タッチターゲットのサイズ

モバイルでは、タップ可能な要素を最低 **44x44px** にしましょう。

```css
.touch-target {
  min-width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

## まとめ

UXの良いWebサイトを作るには、デザインだけでなく実装の細部にも気を配ることが重要です。アニメーション、アクセシビリティ、レスポンシブデザインの3つの柱を意識して、すべてのユーザーにとって快適な体験を提供しましょう。
