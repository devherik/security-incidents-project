// utils/date-utils.ts
import {
  startOfWeek,
  endOfWeek,
  setWeek,
  setYear,
  format,
  getISOWeek,
  getISOWeekYear,
} from "date-fns";

import { type DiaSemana } from "../schemas/enums";

/**
 * Calculates the start and end dates (ISO format) for a given year and week number.
 * Note: Uses ISO week standard (week starts on Monday).
 * @param year The calendar year (e.g., 2025)
 * @param week The week number (1-53)
 * @returns An object with startDate and endDate in 'yyyy-MM-dd' format
 */
export const getDatesFromWeek = (
  year: number,
  week: number
): { startDate: string; endDate: string } => {
  // 1. Get the 4th day of the first week of the year
  // This is a standard way to determine the correct ISO year and week.
  let date = new Date(year, 0, 4); // January 4th of the specified year

  // 2. Set the desired year and week number
  // setYear and setWeek handle the rollover logic correctly
  date = setYear(date, year);
  date = setWeek(date, week, { weekStartsOn: 1 }); // weekStartsOn: 1 means Monday

  // 3. Find the actual start and end of that determined week
  const startDate = startOfWeek(date, { weekStartsOn: 1 }); // Start of the week (Monday)
  const endDate = endOfWeek(date, { weekStartsOn: 1 }); // End of the week (Sunday)

  // 4. Format the dates for the API (e.g., 'YYYY-MM-DD')
  const apiDateFormat = "yyyy-MM-dd";

  return {
    startDate: format(startDate, apiDateFormat),
    endDate: format(endDate, apiDateFormat),
  };
};

export const getCurrentYearAndWeek = (): { year: number; week: number } => {
  const now = new Date();
  const year = getISOWeekYear(now);
  const week = getISOWeek(now);
  return { year, week };
};

export const getDiaSemanaFromDate = (date: Date): string => {
  const diasSemana = ["dom", "seg", "ter", "qua", "qui", "sex", "sab"];
  return diasSemana[date.getDay()];
};

/**
 * Extracts the ISO year, ISO week number, and weekday abbreviation from a Date.
 * @param date The date to extract information from
 * @returns An object with year, week, and weekday (in Portuguese: seg, ter, qua, qui, sex, sáb, dom)
 */
export const getYearWeekAndWeekday = (
  date: Date
): { year: number; week: number; weekday: DiaSemana; ISOdate: string } => {
  const diasSemana = ["dom", "seg", "ter", "qua", "qui", "sex", "sab"];

  return {
    year: getISOWeekYear(date),
    week: getISOWeek(date),
    weekday: diasSemana[date.getDay()] as DiaSemana,
    ISOdate: date.toISOString().split("T")[0],
  };
};

export const formatDateToISO = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

export const parseToAPIFormat = (isoString: string): string => {
  const apiDateFormat = "yyyy-MM-dd";
  return format(isoString, apiDateFormat);
};

export const getNextMonth = () => {
  // Returns the date 30 days from now - api format
  const now = new Date();
  const nextMonth = new Date(now);
  nextMonth.setMonth(now.getMonth() + 1);
  return nextMonth;
};