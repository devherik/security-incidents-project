import { DateRangePicker } from "react-date-range";
import { ptBR } from "date-fns/locale";

import styles from "./style.module.css";

interface DateRange {
  startDate: Date;
  endDate: Date;
  key: string;
}

interface DatePickerProps {
  label?: string;
  value: DateRange;
  onChange: (value: DateRange) => void;
  required?: boolean;
}

export default function DateByRangePicker({
  label = "",
  value,
  onChange,
  required = false,
}: DatePickerProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSelect = (ranges: any) => {
    onChange(ranges.selection);
  };

  return (
    <div className={styles.container}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <div className={styles.inputWrapper}>
        <DateRangePicker
            ranges={[value]}
            onChange={handleSelect}
            showDateDisplay={false}
            showMonthAndYearPickers={false}
            locale={ptBR}
            moveRangeOnFirstSelection={false}
            rangeColors={["var(--green-color)"]}
        />
      </div>
    </div>
  );
}
