/**
 * Core domain types
 * Reine Geschäftsdaten - keine Framework-Abhängigkeiten
 */

// ============ Training Domain ============

export type TrainingPlanId = "A" | "B";
export type FeelingType = "good" | "hard" | "too_hard";

/**
 * Eine Übung in einem Trainingsplan (z.B. "Squats", "Bench Press")
 * Definiert Soll-Werte, nicht tatsächliche Performance
 */
export interface Exercise {
  id: string;
  name: string;
  targetSets: number;
  restSeconds: number;
}

/**
 * Ein Trainingsplan mit festen Übungen (A oder B)
 * Ändert sich nicht während einer Session
 */
export interface TrainingPlan {
  id: TrainingPlanId;
  name: string;
  exercises: Exercise[];
  createdAt: number;
}

/**
 * Tatsächlich absolvierter Satz mit Gewicht und Reps
 */
export interface CompletedSet {
  weight: number;
  reps: number;
  timestamp: number;
}

/**
 * Performance einer Übung in einer Trainingsession
 * Speichert alle Sätze + subjektives Gefühl
 */
export interface ExercisePerformance {
  exerciseId: string;
  sets: CompletedSet[];
  feeling: FeelingType | null;
}

/**
 * Eine komplette Trainingseinheit für einen Tag
 */
export interface TrainingSession {
  id: string;
  planId: TrainingPlanId;
  date: string; // YYYY-MM-DD
  performances: ExercisePerformance[];
  completedAt: number; // timestamp
}

// ============ Nutrition Domain ============

/**
 * Tägliche Ernährungserfassung - super simpel
 */
export interface DailyNutrition {
  date: string; // YYYY-MM-DD
  meal1: boolean; // Mahlzeit 1
  meal2: boolean; // Mahlzeit 2
  shake: boolean;
  notes: string;
  loggedAt: number; // timestamp
}

// ============ Stats/Analytics ============

/**
 * Gewichtstrend pro Übung
 */
export type WeightTrend = "up" | "stable" | "down";

/**
 * Snapshot des letzten Gewichts einer Übung (mit Delta zum Vorherigen)
 */
export interface ExerciseStats {
  exerciseId: string;
  exerciseName: string;
  lastWeight: number | null;
  previousWeight: number | null; // Gewicht vom Training davor
  weightDelta: number | null; // lastWeight - previousWeight (kg Unterschied)
  lastDate: string | null;
  trend: WeightTrend;
  sessionCount: number;
}

/**
 * Wochenübersicht Ernährung
 */
export interface NutritionWeekStats {
  week: string; // YYYY-W##
  totalDays: number;
  completeDays: number; // alle 3 Items erfasst
  averageCompletion: number; // 0-1
}

/**
 * Letzte Performance einer Übung in einem bestimmten Plan
 * Wird in TrainingScreen verwendet als Orientierung für die Gewichte
 */
export interface LastExercisePerformance {
  exerciseId: string;
  exerciseName: string;
  planId: TrainingPlanId;
  maxWeight: number | null; // Schwerstes Gewicht vom letzten Training mit diesem Plan
  maxReps: number | null; // Reps zum schwersten Gewicht
  lastDate: string | null; // Datum des letzten Trainings
}
