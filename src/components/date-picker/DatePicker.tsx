import styles from "./style.module.css";

interface DatePickerProps {
  label?: string;
  value: string; // The value should be a string in 'YYYY-MM-DD' format
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
}

export default function DatePicker({
  label = "",
  value,
  onChange,
  required = false,
  disabled = false,
}: DatePickerProps) {
  return (
    <div className={styles.container}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <div className={styles.inputWrapper}>
        <input
          type="date"
          className={styles.dateInput}
          value={value}
          required={required}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          // Set pattern to enforce format, though type="date" usually handles this
          pattern="\d{4}-\d{2}-\d{2}"
        />
      </div>
    </div>
  );
}