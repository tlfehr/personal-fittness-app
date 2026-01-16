/**
 * Training Screen - Hauptbildschirm für Trainingserfassung
 *
 * UX-Ziel: Minimal, schnell bedienbar im Gym
 * - Zeige nur eine Übung nach der anderen
 * - Schnelle Eingabe: Gewicht + Reps + Enter
 * - Toggle für Gefühl
 * - Zeige letzte Gewichte vom gleichen Plan als Orientierung
 */

import { TrainingSession, ExercisePerformance } from "../domain/types";
import { PLANS } from "../domain/TrainingPlan";
import { getMaxWeightFromPerformance } from "../domain/Training";
import { LocalStorageRepository } from "../infrastructure/storage/LocalStorageRepository";

export class TrainingScreen {
  private container: HTMLElement;
  private session: TrainingSession;
  private currentExerciseIndex: number = 0;
  private repository: LocalStorageRepository;

  constructor(
    container: HTMLElement,
    session: TrainingSession,
    repository: LocalStorageRepository
  ) {
    this.container = container;
    this.session = session;
    this.repository = repository;
  }

  /**
   * Render den kompletten Screen
   */
  render(): void {
    this.container.innerHTML = "";

    const plan = PLANS[this.session.planId];
    const currentExercise = plan.exercises[this.currentExerciseIndex];
    const currentPerformance = this.session.performances[this.currentExerciseIndex];

    // Build sets list
    const setsList = currentPerformance.sets
      .map((set, idx) => {
        return `<div class="set-item">Set ${idx + 1}: ${set.weight}kg × ${set.reps} reps</div>`;
      })
      .join("");

    // Build nav buttons
    const prevBtn = this.currentExerciseIndex > 0 
      ? '<button id="prev-exercise-btn" class="btn">← Zurück</button>' 
      : '';
    
    const nextBtn = this.currentExerciseIndex < plan.exercises.length - 1
      ? '<button id="next-exercise-btn" class="btn btn-success">Weiter →</button>'
      : '<button id="finish-btn" class="btn btn-success">✓ Fertig</button>';

    const html = `
      <div class="screen training-screen">
        <div class="screen-header">
          <button id="home-btn" class="home-btn" title="Zurück zu Home">🏠</button>
          <div class="header-content">
            <h1>${plan.name} - Tag ${this.session.date}</h1>
            <div class="progress-indicator">
              ${this.currentExerciseIndex + 1} / ${plan.exercises.length}
            </div>
          </div>
        </div>

        <div class="exercise-card">
          <h2>${currentExercise.name}</h2>
          <div class="exercise-meta">
            <span>🎯 Sätze: ${currentExercise.targetSets}</span>
            <span>⏱️ Pause: ${currentExercise.restSeconds}s</span>
          </div>

          ${this.renderLastPerformanceHint(currentExercise.id)}

          <div class="sets-history">
            <h3>Absolvierte Sätze (${currentPerformance.sets.length}/${currentExercise.targetSets})</h3>
            <div class="sets-list">
              ${setsList}
            </div>
          </div>

          <div class="set-input-form">
            <input 
              type="number" 
              id="weight-input" 
              placeholder="Gewicht (kg)" 
              min="0"
              step="2.5"
            />
            <input 
              type="number" 
              id="reps-input" 
              placeholder="Wiederholungen" 
              min="1"
              max="50"
            />
            <button id="add-set-btn" class="btn btn-primary">
              + SET
            </button>
          </div>

          <div class="feeling-selector">
            <p>Wie war die Übung?</p>
            <div class="feeling-buttons">
              <button 
                class="btn ${currentPerformance.feeling === "good" ? "active" : ""}" 
                data-feeling="good"
              >
                😊 Gut
              </button>
              <button 
                class="btn ${currentPerformance.feeling === "hard" ? "active" : ""}" 
                data-feeling="hard"
              >
                💪 Hart
              </button>
              <button 
                class="btn ${currentPerformance.feeling === "too_hard" ? "active" : ""}" 
                data-feeling="too_hard"
              >
                😰 Zu hart
              </button>
            </div>
          </div>

          <div class="hint">📌 Letztes Gewicht: -</div>
        </div>

        <div class="navigation">
          ${prevBtn}
          ${nextBtn}
        </div>
      </div>
    `;

    this.container.innerHTML = html;
    this.attachEventListeners();
  }

  /**
   * Attachiere alle Event Listener
   */
  private attachEventListeners(): void {
    // Home Button - mit optionaler Warnung
    document
      .getElementById("home-btn")
      ?.addEventListener("click", () => this.onHomeClick());

    // Add Set
    document
      .getElementById("add-set-btn")
      ?.addEventListener("click", () => this.onAddSet());

    // Feeling buttons
    document.querySelectorAll("[data-feeling]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const feeling = (e.target as HTMLElement).getAttribute(
          "data-feeling"
        ) as "good" | "hard" | "too_hard";
        this.onSetFeeling(feeling);
      });
    });

    // Navigation
    document
      .getElementById("prev-exercise-btn")
      ?.addEventListener("click", () => this.onPrevExercise());

    document
      .getElementById("next-exercise-btn")
      ?.addEventListener("click", () => this.onNextExercise());

    document
      .getElementById("finish-btn")
      ?.addEventListener("click", () => this.onFinish());

    // Quick keyboard shortcuts im Gym
    document.addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.onAddSet();
    });
  }

  private onAddSet(): void {
    const weight = parseFloat(
      (document.getElementById("weight-input") as HTMLInputElement)?.value || "0"
    );
    const reps = parseInt(
      (document.getElementById("reps-input") as HTMLInputElement)?.value || "0"
    );

    if (weight <= 0 || reps <= 0) {
      alert("Gültige Werte eingeben!");
      return;
    }

    // Callback an AppState
    this.onAddSetCallback?.(
      this.session.performances[this.currentExerciseIndex].exerciseId,
      weight,
      reps
    );

    // Clear inputs
    (document.getElementById("weight-input") as HTMLInputElement).value = "";
    (document.getElementById("reps-input") as HTMLInputElement).value = "";
    (document.getElementById("weight-input") as HTMLInputElement).focus();
  }

  private onSetFeeling(feeling: "good" | "hard" | "too_hard"): void {
    this.onSetFeelingCallback?.(
      this.session.performances[this.currentExerciseIndex].exerciseId,
      feeling
    );
  }

  private onPrevExercise(): void {
    if (this.currentExerciseIndex > 0) {
      this.currentExerciseIndex--;
      this.render();
    }
  }

  private onNextExercise(): void {
    const plan = PLANS[this.session.planId];
    if (this.currentExerciseIndex < plan.exercises.length - 1) {
      this.currentExerciseIndex++;
      this.render();
    }
  }

  private onFinish(): void {
    this.onFinishCallback?.();
  }

  private onHomeClick(): void {
    // Prüfe ob ungespeicherte Daten vorhanden sind
    const hasUnsavedSets = this.session.performances.some(p => p.sets.length > 0);
    
    if (hasUnsavedSets) {
      if (confirm("Du hast trainiert. Wirklicht zu Home zurück?\nDeine Daten werden gespeichert.")) {
        this.onHomeCallback?.();
      }
    } else {
      this.onHomeCallback?.();
    }
  }

  private renderLastPerformanceHint(exerciseId: string): string {
    const lastPerf = this.repository.getLastPerformanceForPlan(exerciseId, this.session.planId);

    if (!lastPerf.maxWeight) {
      return `<div class="last-performance-hint">📌 Erstes Mal diese Übung mit Plan ${this.session.planId.toUpperCase()}</div>`;
    }

    return `
      <div class="last-performance-hint">
        <div class="hint-label">Letztes Mal:</div>
        <div class="hint-value">${lastPerf.maxWeight}kg × ${lastPerf.maxReps} reps</div>
        <div class="hint-date">${lastPerf.lastDate}</div>
      </div>
    `;
  }

  // Callbacks (wired durch UI-Manager)
  onAddSetCallback?: (exerciseId: string, weight: number, reps: number) => void;
  onSetFeelingCallback?: (exerciseId: string, feeling: "good" | "hard" | "too_hard") => void;
  onFinishCallback?: () => void;
  onHomeCallback?: () => void;
}
