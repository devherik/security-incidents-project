"use client";

import styles from "./style.module.css";

export default function DatetimeFilterBar({
  year,
  setYear,
  week,
  setWeek,
}: {
  year: number;
  setYear: (value: number) => void;
  week: number;
  setWeek: (value: number) => void;
}) {
  return (
    <div className={styles.container}>
      <div className={styles.inputGroup}>
        <label htmlFor="year-filter" className={styles.label}>
          Ano
        </label>
        <input
          id="year-filter"
          type="number"
          className={styles.input}
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          min={2024}
          max={2100}
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="week-filter" className={styles.label}>
          Semana
        </label>
        <input
          id="week-filter"
          type="number"
          className={styles.input}
          value={week}
          onChange={(e) => setWeek(Number(e.target.value))}
          min={1}
          max={53}
        />
      </div>
    </div>
  );
}