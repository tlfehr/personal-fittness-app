/**
 * Zentraler App State Manager
 * Kein Redux/MobX - nur einfache Listener + localStorage
 * Callbacks für UI-Updates bei Änderungen
 */

import { TrainingSession, DailyNutrition } from "../domain/types";
import {
  createTrainingSession,
  addSetToExercise,
  updateExerciseFeeling,
} from "../domain/Training";
import {
  createDailyNutrition,
  toggleMeal1,
  toggleMeal2,
  toggleShake,
  updateNotes,
} from "../domain/Nutrition";
import { repository } from "../infrastructure/storage/LocalStorageRepository";

type StateListener = () => void;

export class AppState {
  private listeners: Set<StateListener> = new Set();

  // Aktuelle Trainingsession (für den Tag)
  currentTrainingSession: TrainingSession | null = null;

  // Aktuelle Ernährung (für heute)
  currentNutrition: DailyNutrition | null = null;

  constructor() {
    this.initialize();
  }

  /**
   * Lade State aus localStorage beim Start
   */
  private initialize(): void {
    // Timezone-aware date handling
    const date = new Date();
    const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

    // Versuche heutige Session zu laden
    this.currentTrainingSession = repository.getTodaySession();

    // Versuche heutige Ernährung zu laden
    this.currentNutrition = repository.getNutritionByDate(today);
    if (!this.currentNutrition) {
      this.currentNutrition = createDailyNutrition(today);
    }
  }

  /**
   * Subscribe auf State-Änderungen
   */
  subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Notify alle Listener
   */
  private notify(): void {
    this.listeners.forEach((l) => l());
  }

  /**
   * ===== TRAINING ACTIONS =====
   */

  /**
   * Starte neue Trainingsession für einen Plan
   */
  startTrainingSession(planId: "A" | "B"): void {
    // Timezone-aware date handling
    const date = new Date();
    const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    this.currentTrainingSession = createTrainingSession(planId, today);
    this.saveTraining();
  }

  /**
   * Füge einen Satz zu einer Übung hinzu (Autosave nach jedem Set!)
   */
  addSet(
    exerciseId: string,
    weight: number,
    reps: number
  ): void {
    if (!this.currentTrainingSession) {
      console.error("No active training session");
      return;
    }

    const perfIdx = this.currentTrainingSession.performances.findIndex(
      (p) => p.exerciseId === exerciseId
    );
    if (perfIdx < 0) return;

    this.currentTrainingSession.performances[perfIdx] = addSetToExercise(
      this.currentTrainingSession.performances[perfIdx],
      weight,
      reps
    );

    this.saveTraining();
  }

  /**
   * Update Gefühl für Übung
   */
  setExerciseFeeling(
    exerciseId: string,
    feeling: "good" | "hard" | "too_hard"
  ): void {
    if (!this.currentTrainingSession) return;

    const perfIdx = this.currentTrainingSession.performances.findIndex(
      (p) => p.exerciseId === exerciseId
    );
    if (perfIdx < 0) return;

    this.currentTrainingSession.performances[perfIdx] = updateExerciseFeeling(
      this.currentTrainingSession.performances[perfIdx],
      feeling
    );

    this.saveTraining();
  }

  private saveTraining(): void {
    if (this.currentTrainingSession) {
      repository.saveTrainingSession(this.currentTrainingSession);
    }
    this.notify();
  }

  /**
   * ===== NUTRITION ACTIONS =====
   */

  /**
   * Toggle Mahlzeit 1
   */
  toggleMeal1(): void {
    if (!this.currentNutrition) return;
    this.currentNutrition = toggleMeal1(this.currentNutrition);
    this.saveNutrition();
  }

  /**
   * Toggle Mahlzeit 2
   */
  toggleMeal2(): void {
    if (!this.currentNutrition) return;
    this.currentNutrition = toggleMeal2(this.currentNutrition);
    this.saveNutrition();
  }

  /**
   * Toggle Shake
   */
  toggleShake(): void {
    if (!this.currentNutrition) return;
    this.currentNutrition = toggleShake(this.currentNutrition);
    this.saveNutrition();
  }

  /**
   * Update Notizen
   */
  setNutritionNotes(notes: string): void {
    if (!this.currentNutrition) return;
    this.currentNutrition = updateNotes(this.currentNutrition, notes);
    this.saveNutrition();
  }

  private saveNutrition(): void {
    if (this.currentNutrition) {
      repository.saveDailyNutrition(this.currentNutrition);
    }
    this.notify();
  }

  /**
   * ===== DEBUGGING =====
   */
  resetAll(): void {
    repository.clearAllData();
    this.currentTrainingSession = null;
    this.currentNutrition = null;
    this.notify();
  }
}

// Singleton
export const appState = new AppState();
