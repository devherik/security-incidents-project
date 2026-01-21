"use client";

import style from "./style.module.css";

export default function InputForm({
  label = "",
  value,
  setValue,
  rows,
  cols,
  required,
  placeholder,
  disabled = false,
  resize = false,
}: {
  label?: string;
  value: string | number;
  setValue: (value: string) => void;
  rows: number;
  cols?: number;
  required: boolean;
  placeholder?: string;
  disabled?: boolean;
  resize?: boolean;
}) {
  return (
    <form
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <label className={style.label}>
        {label}
        <textarea
          className={`${resize ? "resize-y" : "resize-none"} ${style.input} ${
          disabled ? style.disabled : ""
          }`}
          rows={rows}
          {...(cols !== undefined ? { cols } : {})}
          name="title"
          required={required}
          defaultValue={value}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(v) => {
            setValue(v.target.value);
          }}
          style={{
            width: "100%",
            padding: "8px",
            marginTop: "5px",
          }}
        />
      </label>
    </form>
  );
}
