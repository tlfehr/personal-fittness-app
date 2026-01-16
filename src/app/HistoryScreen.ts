/**
 * History Screen - Trainings- und Ernährungsverlauf
 * Zwei Tabs: Training Log + Ernährung Log
 * Sortiert chronologisch (neueste zuerst)
 */

import { TrainingSession, DailyNutrition } from "../domain/types";
import { PLANS } from "../domain/TrainingPlan";

type HistoryTab = "training" | "nutrition";

export class HistoryScreen {
  private container: HTMLElement;
  private sessions: TrainingSession[];
  private nutritionData: DailyNutrition[];
  private activeTab: HistoryTab = "training";

  constructor(
    container: HTMLElement,
    sessions: TrainingSession[],
    nutritionData: DailyNutrition[]
  ) {
    this.container = container;
    this.sessions = sessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    this.nutritionData = nutritionData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  render(): void {
    this.container.innerHTML = "";

    const html = `
      <div class="screen history-screen">
        <div class="screen-header">
          <h1>📋 Verlauf</h1>
          <p>Training & Ernährung</p>
        </div>

        <!-- TABS -->
        <div class="history-tabs">
          <button id="tab-training" class="tab-btn ${this.activeTab === "training" ? "active" : ""}">
            💪 Training (${this.sessions.length})
          </button>
          <button id="tab-nutrition" class="tab-btn ${this.activeTab === "nutrition" ? "active" : ""}">
            🍽️ Ernährung (${this.nutritionData.length})
          </button>
        </div>

        <!-- CONTENT -->
        <div class="history-content">
          ${this.activeTab === "training" ? this.renderTrainingLog() : this.renderNutritionLog()}
        </div>

        <!-- NAVIGATION -->
        <div class="navigation">
          <button id="back-btn" class="btn">← Zurück</button>
        </div>
      </div>
    `;

    this.container.innerHTML = html;
    this.attachEventListeners();
  }

  private renderTrainingLog(): string {
    if (this.sessions.length === 0) {
      return `<div class="empty-state"><div class="emoji">📭</div><p>Keine Trainings erfasst</p></div>`;
    }

    return `
      <div class="history-list">
        ${this.sessions.map((session) => this.renderTrainingItem(session)).join("")}
      </div>
    `;
  }

  private renderTrainingItem(session: TrainingSession): string {
    const plan = PLANS[session.planId];
    const totalSets = session.performances.reduce((sum, p) => sum + p.sets.length, 0);

    // Berechne max weight
    let maxWeight = 0;
    session.performances.forEach((perf) => {
      perf.sets.forEach((set) => {
        if (set.weight > maxWeight) maxWeight = set.weight;
      });
    });

    const exerciseNames = session.performances
      .filter((p) => p.sets.length > 0)
      .map((p) => {
        const exercise = plan.exercises.find((e) => e.id === p.exerciseId);
        return exercise?.name || p.exerciseId;
      });

    return `
      <div class="history-item training-item">
        <div class="item-date">${this.formatDateFull(session.date)}</div>
        <div class="item-header">
          <div class="item-plan">Plan ${session.planId.toUpperCase()} - ${plan.name}</div>
          <div class="item-stats">
            <span>💪 ${totalSets} Sets</span>
            <span>⚖️ ${maxWeight}kg max</span>
          </div>
        </div>
        <div class="item-exercises">
          ${exerciseNames.join(" • ")}
        </div>
      </div>
    `;
  }

  private renderNutritionLog(): string {
    if (this.nutritionData.length === 0) {
      return `<div class="empty-state"><div class="emoji">📭</div><p>Keine Ernährung erfasst</p></div>`;
    }

    return `
      <div class="history-list">
        ${this.nutritionData.map((nutrition) => this.renderNutritionItem(nutrition)).join("")}
      </div>
    `;
  }

  private renderNutritionItem(nutrition: DailyNutrition): string {
    const completeness = [nutrition.meal1, nutrition.meal2, nutrition.shake].filter(Boolean).length;
    const mealList = [
      nutrition.meal1 ? "🥗 Mahlzeit 1" : null,
      nutrition.meal2 ? "🥗 Mahlzeit 2" : null,
      nutrition.shake ? "🥤 Shake" : null,
    ]
      .filter(Boolean)
      .join(" • ");

    const completenessColor = completeness === 3 ? "#10b981" : completeness >= 2 ? "#f59e0b" : "#ef4444";
    const completenessLabel =
      completeness === 3 ? "✓ Vollständig" : completeness === 2 ? "⚠️ Unvollständig" : "❌ Minimal";

    return `
      <div class="history-item nutrition-item">
        <div class="item-date">${this.formatDateFull(nutrition.date)}</div>
        <div class="item-header">
          <div class="item-meals" style="color: ${completenessColor};">${completenessLabel}</div>
          <div class="item-count">${completeness}/3</div>
        </div>
        <div class="item-exercises">${mealList || "Nichts erfasst"}</div>
        ${nutrition.notes ? `<div class="item-notes">📝 ${nutrition.notes}</div>` : ""}
      </div>
    `;
  }

  private formatDateFull(dateStr: string): string {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("de-DE", {
      weekday: "short",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  }

  private attachEventListeners(): void {
    document.getElementById("tab-training")?.addEventListener("click", () => {
      this.activeTab = "training";
      this.render();
    });

    document.getElementById("tab-nutrition")?.addEventListener("click", () => {
      this.activeTab = "nutrition";
      this.render();
    });

    document.getElementById("back-btn")?.addEventListener("click", () => {
      this.onBackCallback?.();
    });
  }

  onBackCallback?: () => void;
}
