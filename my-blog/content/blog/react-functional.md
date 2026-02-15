---
title: "Reactのクラスコンポーネントを関数コンポーネントへ"
date: "2022-02-01"
image: "/img/i_react.svg"
description: "Reactのクラスコンポーネントを関数コンポーネント+Hooksに書き換える方法を実例で解説します。"
---

## はじめに

React 16.8で導入されたHooksにより、関数コンポーネントでも状態管理やライフサイクル処理が可能になりました。この記事では、クラスコンポーネントを関数コンポーネントに移行する方法を具体的なコード例とともに解説します。

## 基本的な状態管理: state → useState

### クラスコンポーネント

```jsx
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  render() {
    return (
      <div>
        <p>カウント: {this.state.count}</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          +1
        </button>
      </div>
    );
  }
}
```

### 関数コンポーネント

```jsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>カウント: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
}
```

## ライフサイクル → useEffect

### componentDidMount / componentDidUpdate / componentWillUnmount

```jsx
// クラスコンポーネント
class UserProfile extends React.Component {
  state = { user: null };

  componentDidMount() {
    this.fetchUser();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.userId !== this.props.userId) {
      this.fetchUser();
    }
  }

  componentWillUnmount() {
    // クリーンアップ
  }

  fetchUser() {
    fetch(`/api/users/${this.props.userId}`)
      .then(res => res.json())
      .then(user => this.setState({ user }));
  }

  render() {
    // ...
  }
}
```

```jsx
// 関数コンポーネント
import { useState, useEffect } from "react";

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(setUser);

    return () => {
      // クリーンアップ
    };
  }, [userId]);

  // ...
}
```

## カスタムフック

ロジックの再利用はカスタムフックで実現できます。

```jsx
// useWindowSize.js
import { useState, useEffect } from "react";

function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return size;
}

// 使用側
function MyComponent() {
  const { width, height } = useWindowSize();
  return <p>{width} x {height}</p>;
}
```

## useRef: DOM参照とミュータブルな値

```jsx
import { useRef, useEffect } from "react";

function TextInput() {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return <input ref={inputRef} type="text" />;
}
```

## まとめ

関数コンポーネント + Hooksを使うことで、コードがシンプルになり、ロジックの再利用性も向上します。新規コンポーネントは関数コンポーネントで書き、既存のクラスコンポーネントも段階的に移行していくことをおすすめします。
