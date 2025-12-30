import DatePicker from "react-datepicker";
import { ptBR } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";

import {type DateRange } from "../../schemas/stateSchemas";

import styles from "./style.module.css";

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

  return (
    <div className={styles.container}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <div className={styles.inputWrapper}>
        <DatePicker
            selectsRange={true}
            startDate={value.startDate}
            endDate={value.endDate}
            onChange={(dates) => onChange({ startDate: dates[0], endDate: dates[1] })}
            locale={ptBR}
        />
      </div>
    </div>
  );
}
