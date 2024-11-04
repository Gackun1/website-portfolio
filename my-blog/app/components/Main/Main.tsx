import { ReactNode } from "react";

interface MainProps {
  children: ReactNode;
}

import styles from "./Main.module.css";

export default function Main({ children }: MainProps) {
  return <main className={styles.main}>{children}</main>;
}
