import styles from "./2-1-2-CssImport.module.css";

export default function CssImport() {
  return (
    <div id="wd-lab2" className={styles.demo}>
      <h2>Lab 2 - Cascading Style Sheets</h2>
      <h3>Styling with the STYLE attribute</h3>
      <p>
        Style attribute allows configuring look and feel right on the
        element. Although it&apos;s very convenient it is considered bad
        practice and you should avoid using the style attribute
      </p>
    </div>
  );
}
