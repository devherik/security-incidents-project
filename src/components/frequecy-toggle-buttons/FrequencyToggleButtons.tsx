"use client";

import { useCallback, useState } from "react";

import style from "./style.module.css";
import {
  type Frequencia,
  type DiaSemana,
  type WeekNumber,
} from "../../schemas/schemas";
import DatePicker from "../date-picker/DatePicker";
import SelectItemForm from "../select-item-form/SelectItemForm";

const DAYS_OPTIONS: { id: DiaSemana; label: string; content: string }[] = [
  { id: "seg", label: "Seg", content: "segunda-feira" },
  { id: "ter", label: "Ter", content: "terça-feira" },
  { id: "qua", label: "Qua", content: "quarta-feira" },
  { id: "qui", label: "Qui", content: "quinta-feira" },
  { id: "sex", label: "Sex", content: "sexta-feira" },
  { id: "sab", label: "Sab", content: "sábado" },
  { id: "dom", label: "Dom", content: "domingo" },
];

const WEEK_OPTIONS: { id: WeekNumber; label: string }[] = [
  { id: "primeira", label: "primeira" },
  { id: "segunda", label: "segunda" },
  { id: "terceira", label: "terceira" },
  { id: "quarta", label: "quarta" },
  { id: "última", label: "última" },
];

export default function FrequencyToggleButtons({
  currentFrequency,
  onFrequencyChange,
  currentDays,
  onDaysChange,
  currentWeek,
  onWeekChange,
  referenceDate,
  onReferenceDateChange,
}: {
  currentFrequency: Frequencia;
  onFrequencyChange: (value: Frequencia) => void;
  currentDays: DiaSemana[];
  onDaysChange: (days: DiaSemana[]) => void;
  currentWeek: WeekNumber;
  onWeekChange: (week: WeekNumber) => void;
  referenceDate: Date | null;
  onReferenceDateChange: (date: Date | null) => void;
}) {
  const [activeStatus, setActiveStatus] =
    useState<Frequencia>(currentFrequency);

  const handleSelectClick = useCallback(
    (status: Frequencia) => {
      onDaysChange([]); // Reset selected days on frequency change
      setActiveStatus((prevStatus) => {
        if (prevStatus === status) {
          return "diaria"; // Deselect if the same status is clicked
        }
        return status;
      });
      onFrequencyChange(status);
    },
    [onFrequencyChange, onDaysChange]
  );

  const handleSelectChange = useCallback(
    (item: { id: string; descricao: string } | null) => {
      if (item && item.id) {
        handleSelectClick(item.id as Frequencia);
      }
    },
    [handleSelectClick]
  );

  const handleToggleDay = (day: DiaSemana) => {
    // If the day is already selected, we simply toggle it off.
    if (currentDays.includes(day)) {
      onDaysChange(currentDays.filter((d) => d !== day));
      return;
    }

    // If we are adding a new day, we check the frequency rule.
    // "diaria" allows multiple days (e.g., Mon, Wed, Fri).
    // Other frequencies (like "semanal") imply a specific single day anchor.
    if (currentFrequency === "diaria") {
      onDaysChange([...currentDays, day]);
    } else {
      // For non-daily frequencies, we enforce Single Responsibility for the selection
      // by replacing the entire array with the newly selected day.
      onDaysChange([day]);
    }
  };

  return (
    <div className={style.container}>
      <div style={{ width: "40%" }}>
        <SelectItemForm
          label="Frequência"
          items={[
            { id: "diaria", descricao: "diaria" },
            { id: "semanal", descricao: "semanal" },
            { id: "mensal", descricao: "mensal" },
            { id: "trimestral", descricao: "trimestral" },
            { id: "anual", descricao: "anual" },
          ]}
          value={
            activeStatus ? { id: activeStatus, descricao: activeStatus } : null
          }
          onChange={handleSelectChange}
          placeholder="Selecione a frequência"
        />
      </div>

      <div className={style.optionsContainer}>
        <div className="flex flex-row flex-wrap gap-1">
          {(currentFrequency === "diaria" ||
            currentFrequency === "semanal" ||
            currentFrequency === "mensal") &&
            DAYS_OPTIONS.map((day) => {
              const isSelected = currentDays.includes(day.id);
              return (
                <button
                  key={day.id}
                  onClick={() => handleToggleDay(day.id)}
                  className={`${style.dayButton} ${
                    isSelected ? style.dayButtonActive : ""
                  }`}
                  type="button"
                >
                  {day.label}
                </button>
              );
            })}
        </div>

        {currentFrequency === "mensal" && (
          <div className="flex flex-row items-center gap-2 justify-center-safe">
            <p className={style.hintText}>Na</p>
            <select
              className={style.weekSelect}
              value={currentWeek}
              onChange={(e) => onWeekChange(e.target.value as WeekNumber)}
            >
              {WEEK_OPTIONS.map((week) => (
                <option
                  className={style.weekOption}
                  key={week.id}
                  value={week.id}
                >
                  {week.label}
                </option>
              ))}
            </select>
            <p className={style.hintText}>
              {DAYS_OPTIONS.find((day) => day.id === currentDays[0])?.content}{" "}
              do mês.
            </p>
          </div>
        )}
        {(currentFrequency === "trimestral" ||
          currentFrequency === "anual") && (
          <div className="flex flex-row items-center justify-start gap-2">
            <label className={style.label} htmlFor="referenceDate">
              Data de Referência
            </label>
            <DatePicker
              // 2. Defensive Rendering: Check if date exists and is valid before calling methods
              value={
                referenceDate && !isNaN(referenceDate.getTime())
                  ? referenceDate.toISOString().slice(0, 10)
                  : ""
              }
              onChange={(value: string) => {
                // 3. Handle the "Clear" action
                if (!value) {
                  onReferenceDateChange(null);
                  return;
                }

                const newDate = new Date(value);

                // 4. Validation: Only update state if the date is actually valid
                if (!isNaN(newDate.getTime())) {
                  onReferenceDateChange(newDate);
                }
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
