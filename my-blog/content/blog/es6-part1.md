---
title: "ES6を使いこなす 前編"
date: "2022-02-01"
image: "/img/i_js.svg"
description: "ES6で導入されたlet/const、アロー関数、テンプレートリテラルなどの基本機能を解説します。"
---

## はじめに

ES6（ECMAScript 2015）は、JavaScriptに多くの新しい機能を追加した重要なアップデートです。前編では、日常的に最もよく使う基本的な機能について解説します。

## let と const

`var` に代わる新しい変数宣言キーワードが導入されました。

```javascript
// const: 再代入不可
const API_URL = "https://api.example.com";

// let: 再代入可能、ブロックスコープ
let count = 0;
count += 1;

// var の問題点: 関数スコープ
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // 3, 3, 3
}

// let で解決: ブロックスコープ
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // 0, 1, 2
}
```

## アロー関数

関数をより簡潔に書けるアロー関数構文が追加されました。

```javascript
// 従来の関数
const add = function(a, b) {
  return a + b;
};

// アロー関数
const add = (a, b) => a + b;

// 引数が1つの場合、括弧を省略可能
const double = n => n * 2;

// 複数行の場合
const greet = (name) => {
  const message = `Hello, ${name}!`;
  return message;
};
```

### this の束縛

アロー関数は自身の `this` を持たず、外側のスコープの `this` を継承します。

```javascript
class Timer {
  constructor() {
    this.seconds = 0;
  }

  start() {
    // アロー関数なので this は Timer インスタンス
    setInterval(() => {
      this.seconds++;
      console.log(this.seconds);
    }, 1000);
  }
}
```

## テンプレートリテラル

バッククォートを使った文字列の新しい書き方です。

```javascript
const name = "太郎";
const age = 25;

// 従来の文字列結合
const msg1 = "名前: " + name + ", 年齢: " + age;

// テンプレートリテラル
const msg2 = `名前: ${name}, 年齢: ${age}`;

// 複数行
const html = `
  <div>
    <h1>${name}</h1>
    <p>年齢: ${age}歳</p>
  </div>
`;
```

## 分割代入

オブジェクトや配列から値を簡潔に取り出せます。

```javascript
// オブジェクトの分割代入
const user = { name: "太郎", age: 25, city: "東京" };
const { name, age } = user;

// 配列の分割代入
const colors = ["red", "green", "blue"];
const [first, second] = colors;

// デフォルト値
const { role = "user" } = user;

// リネーム
const { name: userName } = user;
```

## まとめ

前編では `let/const`、アロー関数、テンプレートリテラル、分割代入を紹介しました。後編では、スプレッド構文、Promise、モジュールなどを解説します。
