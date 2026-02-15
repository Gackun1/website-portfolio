---
title: "フロントエンドエンジニアとしてのUX 前編"
date: "2022-02-01"
image: "/img/i_design.svg"
description: "フロントエンドエンジニアが知っておくべきUXの基本原則と、実装で意識すべきポイントを解説します。"
---

## はじめに

UX（ユーザーエクスペリエンス）はデザイナーだけの仕事ではありません。フロントエンドエンジニアが実装の段階でUXを意識することで、ユーザーにとって快適なWebサイトを作ることができます。前編では、基本原則と具体的な実装テクニックを紹介します。

## パフォーマンスとUX

ページの読み込み速度は、UXに最も大きな影響を与える要素の一つです。

### Core Web Vitals

Googleが定義する3つの指標を意識しましょう。

- **LCP (Largest Contentful Paint)**: メインコンテンツの表示速度。2.5秒以内が目標。
- **FID (First Input Delay)**: 最初の操作への応答時間。100ms以内が目標。
- **CLS (Cumulative Layout Shift)**: レイアウトのずれ。0.1以下が目標。

### 画像の最適化

```html
<!-- レスポンシブ画像 -->
<img
  srcset="image-400.webp 400w, image-800.webp 800w"
  sizes="(max-width: 600px) 400px, 800px"
  src="image-800.webp"
  alt="説明文"
  loading="lazy"
  decoding="async"
/>
```

### フォントの最適化

```css
/* font-display で FOIT を防ぐ */
@font-face {
  font-family: "MyFont";
  src: url("/fonts/myfont.woff2") format("woff2");
  font-display: swap;
}
```

## ローディング状態のデザイン

ユーザーを待たせる場面では、適切なフィードバックが重要です。

### スケルトンスクリーン

```css
.skeleton {
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 50%,
    #f0f0f0 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

### プログレスインジケーター

長い処理には進捗状況を表示しましょう。

```jsx
function UploadProgress({ progress }) {
  return (
    <div className="progress-bar">
      <div
        className="progress-fill"
        style={{ width: `${progress}%` }}
      />
      <span>{progress}%</span>
    </div>
  );
}
```

## フォームのUX

### リアルタイムバリデーション

```jsx
function EmailInput() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const validate = (value) => {
    if (!value.includes("@")) {
      setError("有効なメールアドレスを入力してください");
    } else {
      setError("");
    }
  };

  return (
    <div>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onBlur={(e) => validate(e.target.value)}
      />
      {error && <p className="error">{error}</p>}
    </div>
  );
}
```

## まとめ

前編では、パフォーマンス、ローディング状態、フォームのUXについて解説しました。後編では、アニメーション、アクセシビリティ、レスポンシブデザインについて掘り下げます。
