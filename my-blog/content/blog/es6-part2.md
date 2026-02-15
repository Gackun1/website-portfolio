---
title: "ES6を使いこなす 後編"
date: "2022-02-01"
image: "/img/i_js.svg"
description: "ES6のスプレッド構文、Promise、async/await、モジュールシステムなどの応用機能を解説します。"
---

## はじめに

前編に引き続き、ES6の便利な機能を紹介します。後編では、より実践的な機能であるスプレッド構文、Promise、クラス構文、モジュールシステムについて解説します。

## スプレッド構文とレスト構文

`...` を使った柔軟なデータ操作が可能になりました。

```javascript
// 配列のスプレッド
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5]; // [1, 2, 3, 4, 5]

// オブジェクトのスプレッド
const defaults = { theme: "dark", lang: "ja" };
const config = { ...defaults, lang: "en" };
// { theme: "dark", lang: "en" }

// レスト構文（残余引数）
const sum = (...numbers) => {
  return numbers.reduce((acc, n) => acc + n, 0);
};
sum(1, 2, 3, 4); // 10
```

## Promise と非同期処理

コールバック地獄を解消する Promise パターンです。

```javascript
// Promise の基本
const fetchUser = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id > 0) {
        resolve({ id, name: "太郎" });
      } else {
        reject(new Error("Invalid ID"));
      }
    }, 1000);
  });
};

// チェーン
fetchUser(1)
  .then(user => console.log(user.name))
  .catch(err => console.error(err));

// Promise.all で並列実行
const [user, posts] = await Promise.all([
  fetchUser(1),
  fetchPosts(1),
]);
```

## async / await

Promise をさらに読みやすく書ける構文です。

```javascript
// async/await
async function loadUserData(id) {
  try {
    const user = await fetchUser(id);
    const posts = await fetchPosts(user.id);
    return { user, posts };
  } catch (error) {
    console.error("データ取得に失敗:", error);
    throw error;
  }
}
```

## Map と Set

新しいデータ構造が追加されました。

```javascript
// Map: キーに任意の型を使える
const map = new Map();
map.set("name", "太郎");
map.set(42, "数値キー");
map.get("name"); // "太郎"

// Set: 重複のないコレクション
const set = new Set([1, 2, 2, 3, 3]);
console.log([...set]); // [1, 2, 3]

// 配列の重複除去
const unique = [...new Set(array)];
```

## モジュールシステム

`import` / `export` によるモジュール管理が標準化されました。

```javascript
// math.js - 名前付きエクスポート
export const PI = 3.14159;
export const add = (a, b) => a + b;

// utils.js - デフォルトエクスポート
export default function formatDate(date) {
  return date.toLocaleDateString("ja-JP");
}

// 使用側
import formatDate from "./utils.js";
import { PI, add } from "./math.js";
```

## まとめ

ES6の機能を前後編で紹介しました。これらの機能はモダンなJavaScript開発の基礎です。特にアロー関数、分割代入、スプレッド構文、async/awaitは日常的に使用するので、しっかり身につけておきましょう。
