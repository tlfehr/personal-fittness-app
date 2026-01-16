/**
 * Training Domain Logic
 * Pure functions - keine Seiteneffekte, keine I/O
 */

import {
  TrainingSession,
  ExercisePerformance,
  CompletedSet,
  FeelingType,
  TrainingPlanId,
  ExerciseStats,
  WeightTrend,
} from "./types";
import { PLANS } from "./TrainingPlan";

/**
 * Erstelle eine neue Trainingsession für einen bestimmten Plan
 */
export function createTrainingSession(
  planId: TrainingPlanId,
  date: string
): TrainingSession {
  const plan = PLANS[planId];
  return {
    id: `session_${planId}_${date}`,
    planId,
    date,
    performances: plan.exercises.map((ex) => ({
      exerciseId: ex.id,
      sets: [],
      feeling: null,
    })),
    completedAt: Date.now(),
  };
}

/**
 * Füge einen Satz zu einer Übung hinzu (z.B. nach dem Set im Gym)
 */
export function addSetToExercise(
  performance: ExercisePerformance,
  weight: number,
  reps: number
): ExercisePerformance {
  return {
    ...performance,
    sets: [
      ...performance.sets,
      {
        weight,
        reps,
        timestamp: Date.now(),
      },
    ],
  };
}

/**
 * Ändere das Gefühl für eine Übung (nach dem letzten Satz)
 */
export function updateExerciseFeeling(
  performance: ExercisePerformance,
  feeling: FeelingType
): ExercisePerformance {
  return {
    ...performance,
    feeling,
  };
}

/**
 * Berechne den Gewichtstrend für eine Übung
 * Vergleich: letzter Trainingstag vs. vorheriger Trainingstag
 */
export function calculateWeightTrend(
  exerciseStats: ExerciseStats[]
): WeightTrend {
  // Placeholder - wird später von Repository gefüllt
  return "stable";
}

/**
 * Extrahiere das höchste Gewicht eines Satzes aus einer Performance
 */
export function getMaxWeightFromPerformance(
  performance: ExercisePerformance
): number | null {
  if (performance.sets.length === 0) return null;
  return Math.max(...performance.sets.map((s) => s.weight));
}

/**
 * Filtere nur abgeschlossene Sessions (mit mindestens 1 Satz)
 */
export function isSessionComplete(session: TrainingSession): boolean {
  return session.performances.every((perf) => perf.sets.length > 0);
}

/**
 * Berechne durchschnittliche Wiederholungen pro Satz
 */
export function getAverageReps(performance: ExercisePerformance): number {
  if (performance.sets.length === 0) return 0;
  const totalReps = performance.sets.reduce((sum, s) => sum + s.reps, 0);
  return totalReps / performance.sets.length;
}
