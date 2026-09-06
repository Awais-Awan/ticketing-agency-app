import styles from "./EmptyState.module.css";

function EmptyState({ message }) {
  return (
    <div className={styles.emptyState}>
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="7" width="18" height="14" rx="2"></rect>
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      </svg>
      <p>{message}</p>
    </div>
  );
}

export default EmptyState;