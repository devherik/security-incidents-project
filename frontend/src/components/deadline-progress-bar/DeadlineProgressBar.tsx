import React from "react";
import { calculateDeadlineProgress } from "../../utils/deadlineUtil";
import style from "./style.module.css";

interface DeadlineProgressBarProps {
  dtcriacao: string | Date;
  data_limite: string | Date;
  showLabel?: boolean;
}

/**
 * DeadlineProgressBar Component
 * 
 * Visualizes the time remaining until a deadline using a colored progress bar.
 * The bar starts full (Green) and decreases as the deadline approaches, 
 * turning Yellow at 50% and Red at 20%.
 * 
 * Adheres to the Single Responsibility Principle by delegating calculation logic 
 * to a utility function.
 * 
 * @param dtcriacao - The start date of the period.
 * @param data_limite - The end date (deadline).
 * @param showLabel - Optional flag to show the percentage text.
 */
export const DeadlineProgressBar: React.FC<DeadlineProgressBarProps> = ({
  dtcriacao,
  data_limite,
  showLabel = false,
}) => {
  const { percentage, status } = calculateDeadlineProgress(dtcriacao, data_limite);

  // Map status to CSS class
  const statusClass = style[status];

  return (
    <div className={style.wrapper}>
      <div 
        className={style.container} 
        role="progressbar" 
        aria-valuenow={Math.round(percentage)} 
        aria-valuemin={0} 
        aria-valuemax={100}
        title={`Tempo restante: ${Math.round(percentage)}%`}
      >
        <div
          className={`${style.bar} ${statusClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <span className={style.tooltip}>
          {Math.round(percentage)}% do prazo restante
        </span>
      )}
    </div>
  );
};
