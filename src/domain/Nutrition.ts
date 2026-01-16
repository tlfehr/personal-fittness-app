/**
 * Nutrition Domain Logic
 * Pure functions für tägliche Ernährungserfassung
 */

import { DailyNutrition, NutritionWeekStats } from "./types";

/**
 * Erstelle einen neuen täglichen Ernährungseintrag
 */
export function createDailyNutrition(date: string): DailyNutrition {
  return {
    date,
    meal1: false,
    meal2: false,
    shake: false,
    notes: "",
    loggedAt: Date.now(),
  };
}

/**
 * Toggele eine Mahlzeit (einfache 1-Klick-Erfassung)
 */
export function toggleMeal1(nutrition: DailyNutrition): DailyNutrition {
  return { ...nutrition, meal1: !nutrition.meal1 };
}

export function toggleMeal2(nutrition: DailyNutrition): DailyNutrition {
  return { ...nutrition, meal2: !nutrition.meal2 };
}

export function toggleShake(nutrition: DailyNutrition): DailyNutrition {
  return { ...nutrition, shake: !nutrition.shake };
}

/**
 * Update Notizen
 */
export function updateNotes(
  nutrition: DailyNutrition,
  notes: string
): DailyNutrition {
  return { ...nutrition, notes };
}

/**
 * Prüfe ob der Tag "vollständig" ist (alle 3 Items erfasst)
 */
export function isNutritionComplete(nutrition: DailyNutrition): boolean {
  return nutrition.meal1 && nutrition.meal2 && nutrition.shake;
}

/**
 * Berechne Wochenstatistik
 * Hinweis: ISO week calculation (Montag = Start)
 */
export function calculateNutritionWeekStats(
  nutritionDays: DailyNutrition[]
): NutritionWeekStats {
  const completeDays = nutritionDays.filter(isNutritionComplete).length;
  const totalDays = nutritionDays.length;

  return {
    week: getISOWeek(new Date(nutritionDays[0]?.date || new Date())),
    totalDays,
    completeDays,
    averageCompletion: totalDays > 0 ? completeDays / totalDays : 0,
  };
}

/**
 * Hilfsfunktion: ISO Week string (YYYY-W##)
 */
function getISOWeek(date: Date): string {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${d.getFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

/**
 * Hole alle Tage der aktuellen Woche
 */
export function getWeekDates(referenceDate: string): string[] {
  const d = new Date(referenceDate);
  const week = [];
  d.setDate(d.getDate() - d.getDay() + 1); // Montag
  for (let i = 0; i < 7; i++) {
    week.push(d.toISOString().split("T")[0]);
    d.setDate(d.getDate() + 1);
  }
  return week;
}
