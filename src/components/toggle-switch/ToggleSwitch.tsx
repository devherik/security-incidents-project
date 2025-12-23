import React from "react";
import style from "./style.module.css";

interface ToggleSwitchProps {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
}

export default function ToggleSwitch({
  label,
  checked,
  onChange,
  disabled = false,
  id = "toggle-switch",
}: ToggleSwitchProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled) {
      onChange(event.target.checked);
    }
  };

  return (
    <div className={style.toggleContainer}>
      {label && (
        <label htmlFor={id} className={style.label}>
          {label}
        </label>
      )}
      <label className={style.switch} htmlFor={id}>
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          className={style.input}
        />
        <span className={`${style.slider} ${disabled ? style.disabled : ""}`}></span>
      </label>
    </div>
  );
}