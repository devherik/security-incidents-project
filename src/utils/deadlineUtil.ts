import { differenceInMilliseconds } from "date-fns";

export interface DeadlineProgress {
  percentage: number;
  status: "safe" | "warning" | "critical";
}

/**
 * Calculates the progress towards a deadline.
 * 
 * @param dtcriacao - The creation date of the RCI.
 * @param data_limite - The deadline date.
 * @returns An object containing the percentage of time elapsed and a status string.
 */
export const calculateDeadlineProgress = (
  dtcriacao: string | Date,
  data_limite: string | Date
): DeadlineProgress => {
  const start = new Date(dtcriacao);
  const end = new Date(data_limite);
  const now = new Date();

  const totalDuration = differenceInMilliseconds(end, start);
  const remaining = differenceInMilliseconds(end, now);

  // If the deadline is in the past relative to creation, or total duration is 0
  if (totalDuration <= 0) {
    return { percentage: 0, status: "critical" };
  }

  let percentage = (remaining / totalDuration) * 100;
  
  // Clamp percentage between 0 and 100
  percentage = Math.min(Math.max(percentage, 0), 100);

  let status: DeadlineProgress["status"] = "safe";
  if (percentage <= 20) {
    status = "critical";
  } else if (percentage <= 50) {
    status = "warning";
  }

  return { percentage, status };
};
