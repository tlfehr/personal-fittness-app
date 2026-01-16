/**
 * Repository Pattern für lokale Persistenz
 * Abstrahiert localStorage - leicht austauschbar gegen IndexedDB/SQLite später
 *
 * WICHTIG: Autosave nach jeder Änderung!
 */

import {
  TrainingSession,
  DailyNutrition,
  TrainingPlanId,
  ExerciseStats,
} from "../../domain/types";
import { PLANS } from "../../domain/TrainingPlan";

const STORAGE_KEYS = {
  TRAINING_SESSIONS: "fitness_training_sessions",
  NUTRITION: "fitness_nutrition",
  LAST_SYNC: "fitness_last_sync",
};

export class LocalStorageRepository {
  /**
   * ===== TRAINING SESSIONS =====
   */

  /**
   * Speichere eine Trainingsession sofort (Autosave)
   */
  saveTrainingSession(session: TrainingSession): void {
    const sessions = this.getAllTrainingSessions();
    const existingIdx = sessions.findIndex((s) => s.id === session.id);

    if (existingIdx >= 0) {
      sessions[existingIdx] = session;
    } else {
      sessions.push(session);
    }

    localStorage.setItem(
      STORAGE_KEYS.TRAINING_SESSIONS,
      JSON.stringify(sessions)
    );
  }

  /**
   * Lade alle Trainingsessions
   */
  getAllTrainingSessions(): TrainingSession[] {
    const stored = localStorage.getItem(STORAGE_KEYS.TRAINING_SESSIONS);
    return stored ? JSON.parse(stored) : [];
  }

  /**
   * Lade Sessions für einen bestimmten Tag
   */
  getTrainingSessionByDate(date: string): TrainingSession | null {
    const sessions = this.getAllTrainingSessions();
    return sessions.find((s) => s.date === date) || null;
  }

  /**
   * Lade Session für heute
   */
  getTodaySession(): TrainingSession | null {
    return this.getTrainingSessionByDate(this.getTodayString());
  }

  /**
   * ===== NUTRITION =====
   */

  /**
   * Speichere/aktualisiere täglichen Ernährungseintrag (Autosave)
   */
  saveDailyNutrition(nutrition: DailyNutrition): void {
    const allNutrition = this.getAllNutrition();
    const existingIdx = allNutrition.findIndex((n) => n.date === nutrition.date);

    if (existingIdx >= 0) {
      allNutrition[existingIdx] = nutrition;
    } else {
      allNutrition.push(nutrition);
    }

    localStorage.setItem(STORAGE_KEYS.NUTRITION, JSON.stringify(allNutrition));
  }

  /**
   * Lade alle Ernährungseinträge
   */
  getAllNutrition(): DailyNutrition[] {
    const stored = localStorage.getItem(STORAGE_KEYS.NUTRITION);
    return stored ? JSON.parse(stored) : [];
  }

  /**
   * Lade Ernährungseintrag für spezifisches Datum
   */
  getNutritionByDate(date: string): DailyNutrition | null {
    const all = this.getAllNutrition();
    return all.find((n) => n.date === date) || null;
  }

  /**
   * Lade Ernährungseinträge für Woche
   */
  getNutritionForWeek(startDate: string): DailyNutrition[] {
    const all = this.getAllNutrition();
    const dates = this.getWeekDates(startDate);
    return all.filter((n) => dates.includes(n.date));
  }

  /**
   * ===== ANALYTICS =====
   */

  /**
   * Berechne Stats für eine Übung basierend auf Verlauf
   * (Letztes Gewicht, Trend, Anzahl Sessions)
   */
  getExerciseStats(exerciseId: string): ExerciseStats {
    const sessions = this.getAllTrainingSessions();
    const performances = sessions
      .flatMap((s) => s.performances)
      .filter((p) => p.exerciseId === exerciseId);

    if (performances.length === 0) {
      return {
        exerciseId,
        exerciseName: this.getExerciseNameById(exerciseId),
        lastWeight: null,
        lastDate: null,
        trend: "stable",
        sessionCount: 0,
      };
    }

    // Sortiere nach timestamp (neueste zuerst)
    const sorted = performances.sort(
      (a, b) =>
        (b.sets[b.sets.length - 1]?.timestamp || 0) -
        (a.sets[a.sets.length - 1]?.timestamp || 0)
    );

    const lastPerf = sorted[0];
    const lastWeight = Math.max(...lastPerf.sets.map((s) => s.weight));
    const lastDate = new Date(lastPerf.sets[lastPerf.sets.length - 1]?.timestamp)
      .toISOString()
      .split("T")[0];

    // Berechne Trend: vergleiche letztes Gewicht mit durchschnitt der vorherigen 5
    let trend: "up" | "stable" | "down" = "stable";
    if (sorted.length > 1) {
      const avgPrevious =
        sorted.slice(1, 6).reduce((sum, p) => {
          const maxW = Math.max(...p.sets.map((s) => s.weight));
          return sum + maxW;
        }, 0) / Math.min(5, sorted.length - 1);

      if (lastWeight > avgPrevious * 1.02) {
        trend = "up";
      } else if (lastWeight < avgPrevious * 0.98) {
        trend = "down";
      }
    }

    // Berechne weightDelta: Unterschied zum vorherigen Training
    let previousWeight: number | null = null;
    if (sorted.length > 1) {
      const prevPerf = sorted[1];
      previousWeight = Math.max(...prevPerf.sets.map((s) => s.weight));
    }
    const weightDelta = previousWeight !== null ? lastWeight - previousWeight : null;

    return {
      exerciseId,
      exerciseName: this.getExerciseNameById(exerciseId),
      lastWeight,
      previousWeight,
      weightDelta,
      lastDate,
      trend,
      sessionCount: performances.length,
    };
  }

  /**
   * ===== UTILS =====
   */

  private getTodayString(): string {
    // Timezone-aware date handling (not UTC)
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  private getWeekDates(startDate: string): string[] {
    const d = new Date(startDate);
    const week = [];
    d.setDate(d.getDate() - d.getDay() + 1); // Montag
    for (let i = 0; i < 7; i++) {
      week.push(d.toISOString().split("T")[0]);
      d.setDate(d.getDate() + 1);
    }
    return week;
  }

  private getExerciseNameById(exerciseId: string): string {
    for (const plan of Object.values(PLANS)) {
      const ex = plan.exercises.find((e) => e.id === exerciseId);
      if (ex) return ex.name;
    }
    return exerciseId;
  }

  /**
   * Finde die letzten Gewichte einer Übung für einen bestimmten Plan
   * Wird in TrainingScreen verwendet um dem User eine Orientierung zu geben
   */
  getLastPerformanceForPlan(
    exerciseId: string,
    planId: "A" | "B"
  ): { maxWeight: number | null; maxReps: number | null; lastDate: string | null } {
    const sessions = this.getAllTrainingSessions();

    // Filter: nur Sessions mit diesem Plan
    const planSessions = sessions
      .filter((s) => s.planId === planId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (planSessions.length === 0) {
      return { maxWeight: null, maxReps: null, lastDate: null };
    }

    // Finde die letzte Session mit dieser Übung
    for (const session of planSessions) {
      const perf = session.performances.find((p) => p.exerciseId === exerciseId);
      if (perf && perf.sets.length > 0) {
        // Finde max weight in dieser Session
        let maxWeight = 0;
        let maxReps = 0;
        perf.sets.forEach((set) => {
          if (set.weight > maxWeight) {
            maxWeight = set.weight;
            maxReps = set.reps;
          }
        });

        return {
          maxWeight,
          maxReps,
          lastDate: session.date,
        };
      }
    }

    return { maxWeight: null, maxReps: null, lastDate: null };
  }

  /**
   * 🗑️ DEBUGGING: Leere alle Daten
   */
  clearAllData(): void {
    localStorage.removeItem(STORAGE_KEYS.TRAINING_SESSIONS);
    localStorage.removeItem(STORAGE_KEYS.NUTRITION);
  }
}

export const repository = new LocalStorageRepository();
