import styles from "./Spinner.module.css";

function Spinner() {
  return <div className={styles.spinner} role="status" aria-label="Loading" />;
}

export default Spinner;