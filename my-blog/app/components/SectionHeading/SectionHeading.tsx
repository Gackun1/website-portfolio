import styles from "./SectionHeading.module.scss";

interface SectionHeadingProps {
  name: string;
  args?: string;
}

export default function SectionHeading({ name, args = "" }: SectionHeadingProps) {
  return (
    <h2 className={styles.heading}>
      &gt; <span className={styles.green}>.{name}</span>
      <span className={styles.yellow}>({args})</span>
    </h2>
  );
}
