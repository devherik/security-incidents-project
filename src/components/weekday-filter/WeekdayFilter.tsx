"use client";

import style from "./style.module.css";

// Define the valid days and their display order
export type Day = "seg" | "ter" | "qua" | "qui" | "sex" | "sab" | "dom";
export type WeekNumber =
  | "1ª Semana"
  | "2ª Semana"
  | "3ª Semana"
  | "4ª Semana"
  | "Última Semana";

const DAYS_OPTIONS: { id: Day; label: string }[] = [
  { id: "seg", label: "Seg" },
  { id: "ter", label: "Ter" },
  { id: "qua", label: "Qua" },
  { id: "qui", label: "Qui" },
  { id: "sex", label: "Sex" },
  { id: "sab", label: "Sab" },
  { id: "dom", label: "Dom" },
];

export default function WeekDayFilterButtons({
  selectedDays,
  onToggleDay,
  selectedWeek,
  onToggleWeek,
}: {
  selectedDays: Day[];
  onToggleDay: (day: Day) => void;
  selectedWeek?: WeekNumber;
  onToggleWeek?: (week: WeekNumber) => void;
}) {
  return (
    <div className={style.filterContainer}>
      {DAYS_OPTIONS.map((day) => {
        const isSelected = selectedDays.includes(day.id);
        return (
          <button
            key={day.id}
            onClick={() => onToggleDay(day.id)}
            className={`${style.dayButton} ${
              isSelected ? style.dayButtonActive : ""
            }`}
            type="button"
          >
            {day.label}
          </button>
        );
      })}
      {selectedWeek && onToggleWeek && (
        <select
          className={style.weekSelect}
          value={selectedWeek}
          onChange={(e) => onToggleWeek!(e.target.value as WeekNumber)}
        >
          <option value="1ª Semana">1ª Semana</option>
          <option value="2ª Semana">2ª Semana</option>
          <option value="3ª Semana">3ª Semana</option>
          <option value="4ª Semana">4ª Semana</option>
          <option value="Última Semana">Última Semana</option>
        </select>
      )}
    </div>
  );
}
