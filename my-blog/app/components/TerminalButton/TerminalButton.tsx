import styles from "./TerminalButton.module.scss";

interface TerminalButtonProps {
  label: string;
  href?: string;
  type?: "link" | "submit";
  disabled?: boolean;
}

export default function TerminalButton({
  label,
  href = "#",
  type = "link",
  disabled = false,
}: TerminalButtonProps) {
  if (type === "submit") {
    return (
      <div className={styles.button}>
        <span className={styles.prompt}>&gt;</span>
        <input type="submit" value={label} className={styles.text} disabled={disabled} />
        <span className={styles.spacer} />
      </div>
    );
  }

  return (
    <a href={href} className={styles.button}>
      <span className={styles.prompt}>&gt;</span>
      <span className={styles.text}>{label}</span>
      <span className={styles.spacer} />
    </a>
  );
}
