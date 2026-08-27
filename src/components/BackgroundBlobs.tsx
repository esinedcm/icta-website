import styles from "./BackgroundBlobs.module.css";

export default function BackgroundBlobs() {
  return (
    <div className={styles.blobsContainer}>
      <div className={`${styles.blob} ${styles.blob1}`}></div>
      <div className={`${styles.blob} ${styles.blob2}`}></div>
      <div className={`${styles.blob} ${styles.blob3}`}></div>
    </div>
  );
}
