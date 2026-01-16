/**
 * Calendar Domain Logic
 * Streaks, Heatmap-Daten, Statistiken (Training + Nutrition)
 */

import { TrainingSession, DailyNutrition } from "./types";

export interface HeatmapDay {
  date: string;
  setCount: number;
  intensity: "none" | "low" | "medium" | "high"; // Based on set count
  hasCompleteNutrition: boolean; // Alle 3 Mahlzeiten erfasst?
}

export interface CalendarStats {
  currentStreak: number;
  longestStreak: number;
  thisMonthSessions: number;
  bestDaySetCount: number;
  totalSetCount: number;
}

/**
 * Berechne aktuelle Trainings-Serie (Streaks)
 * Zählt aufeinanderfolgende Tage MIT Training
 */
export function calculateCurrentStreak(sessions: TrainingSession[]): number {
  if (sessions.length === 0) return 0;

  // Sortiere nach Datum (neueste zuerst)
  const sorted = sessions
    .filter((s) => s.performances.some((p) => p.sets.length > 0))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (sorted.length === 0) return 0;

  // Timezone-aware: use local date, not UTC
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  
  let streak = 0;
  let currentDateStr = today;

  for (const session of sorted) {
    if (session.date === currentDateStr) {
      streak++;
      // Move to previous day
      const [year, month, day] = currentDateStr.split("-").map(Number);
      const prevDate = new Date(year, month - 1, day - 1);
      currentDateStr = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, "0")}-${String(prevDate.getDate()).padStart(2, "0")}`;
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Berechne längste bisherige Serie
 */
export function calculateLongestStreak(sessions: TrainingSession[]): number {
  if (sessions.length === 0) return 0;

  // Sortiere nach Datum
  const trainedDates = sessions
    .filter((s) => s.performances.some((p) => p.sets.length > 0))
    .map((s) => new Date(s.date).getTime())
    .sort((a, b) => a - b);

  if (trainedDates.length === 0) return 0;

  let maxStreak = 1;
  let currentStreak = 1;
  const oneDay = 24 * 60 * 60 * 1000;

  for (let i = 1; i < trainedDates.length; i++) {
    if (trainedDates[i] - trainedDates[i - 1] === oneDay) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }

  return maxStreak;
}

/**
 * Berechne Heatmap-Daten für einen Monat (Training + Ernährung)
 */
export function getMonthHeatmap(
  sessions: TrainingSession[],
  nutritionData: DailyNutrition[],
  year: number,
  month: number
): HeatmapDay[] {
  const heatmap: HeatmapDay[] = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const sessionsByDate = new Map<string, number>();
  sessions.forEach((s) => {
    const setCount = s.performances.reduce((sum, p) => sum + p.sets.length, 0);
    const key = s.date;
    sessionsByDate.set(key, (sessionsByDate.get(key) || 0) + setCount);
  });

  const nutritionByDate = new Map<string, DailyNutrition>();
  nutritionData.forEach((n) => {
    nutritionByDate.set(n.date, n);
  });

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    const setCount = sessionsByDate.get(dateStr) || 0;

    // Prüfe Ernährung: alle 3 Mahlzeiten?
    const nutrition = nutritionByDate.get(dateStr);
    const hasCompleteNutrition = nutrition ? nutrition.meal1 && nutrition.meal2 && nutrition.shake : false;

    const intensity =
      setCount === 0 ? "none" : setCount <= 5 ? "low" : setCount <= 10 ? "medium" : "high";

    heatmap.push({
      date: dateStr,
      setCount,
      intensity,
      hasCompleteNutrition,
    });
  }

  return heatmap;
}

/**
 * Berechne Gesamt-Kalender-Statistiken
 */
export function calculateCalendarStats(sessions: TrainingSession[]): CalendarStats {
  const trainedSessions = sessions.filter((s) =>
    s.performances.some((p) => p.sets.length > 0)
  );

  if (trainedSessions.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      thisMonthSessions: 0,
      bestDaySetCount: 0,
      totalSetCount: 0,
    };
  }

  // This month
  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const thisMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const thisMonthSessions = trainedSessions.filter((s) => {
    const d = new Date(s.date);
    return d >= thisMonthStart && d <= thisMonthEnd;
  }).length;

  // Best day & total sets
  let bestDaySetCount = 0;
  let totalSetCount = 0;

  trainedSessions.forEach((s) => {
    const setCount = s.performances.reduce((sum, p) => sum + p.sets.length, 0);
    bestDaySetCount = Math.max(bestDaySetCount, setCount);
    totalSetCount += setCount;
  });

  return {
    currentStreak: calculateCurrentStreak(sessions),
    longestStreak: calculateLongestStreak(sessions),
    thisMonthSessions,
    bestDaySetCount,
    totalSetCount,
  };
}

/**
 * Hole letzte N Trainings-Sessions
 */
export function getRecentSessions(sessions: TrainingSession[], limit: number = 10) {
  return sessions
    .filter((s) => s.performances.some((p) => p.sets.length > 0))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}

/**
 * Format Datum für Anzeige
 */
export function formatDateWithDay(dateStr: string): string {
  const date = new Date(dateStr);
  const days = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
  return `${days[date.getDay()]} ${dateStr}`;
}
