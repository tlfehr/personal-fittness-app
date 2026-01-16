/**
 * Stats Screen - Minimal Progress Overview
 * - Letztes Gewicht pro Übung
 * - Trend Indicator
 * - Wochenübersicht Ernährung
 */

import { ExerciseStats, NutritionWeekStats, TrainingSession } from "../domain/types";
import { repository } from "../infrastructure/storage/LocalStorageRepository";

export class StatsScreen {
  private container: HTMLElement;
  private exerciseStats: ExerciseStats[];
  private nutritionStats: NutritionWeekStats;
  private sessions: TrainingSession[];

  constructor(
    container: HTMLElement,
    exerciseStats: ExerciseStats[],
    nutritionStats: NutritionWeekStats,
    sessions: TrainingSession[] = []
  ) {
    this.container = container;
    this.exerciseStats = exerciseStats;
    this.nutritionStats = nutritionStats;
    this.sessions = sessions;
  }

  render(): void {
    this.container.innerHTML = "";

    const html = `
      <div class="screen stats-screen">
        <!-- HEADER -->
        <div class="screen-header">
          <h1>📊 Fortschritt</h1>
          <p>Letztes Training pro Übung</p>
        </div>

        <!-- WEEKLY VOLUME -->
        <div class="stats-section">
          <h2>📈 Diese Woche</h2>
          <div class="weekly-summary">
            ${this.renderWeeklyVolume()}
          </div>
        </div>

        <!-- TRAINING STATS -->
        <div class="stats-section">
          <h2>💪 Gewicht & Trend</h2>
          <p style="font-size: 0.85rem; color: #666; margin-bottom: 1rem;">
            <strong>Letztes Training</strong> - Klicke Training starten um zu updaten
          </p>
          <div class="exercise-stats">
            ${this.exerciseStats.map((stat) => this.renderExerciseStat(stat)).join("")}
          </div>
        </div>

        <!-- NUTRITION STATS -->
        <div class="stats-section">
          <h2>🍽️ Diese Woche (${this.nutritionStats.week})</h2>
          <div class="nutrition-stats">
            <div class="stat-item">
              <div class="stat-label">Tage erfasst:</div>
              <div class="stat-value">
                ${this.nutritionStats.completeDays} / ${this.nutritionStats.totalDays}
              </div>
              <div class="stat-bar">
                <div 
                  class="stat-bar-fill" 
                  style="width: ${this.nutritionStats.averageCompletion * 100}%"
                ></div>
              </div>
            </div>
          </div>
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

  private renderExerciseStat(stat: ExerciseStats): string {
    if (!stat.lastWeight) {
      return `
        <div class="exercise-stat">
          <div class="exercise-name">${stat.exerciseName}</div>
          <div class="exercise-last-weight">Keine Daten</div>
          <div class="exercise-meta">0 sessions</div>
        </div>
      `;
    }

    const trendEmoji =
      stat.trend === "up" ? "📈" : stat.trend === "down" ? "📉" : "→";

    // Formatiere weightDelta
    let deltaStr = "";
    if (stat.weightDelta !== null) {
      const sign = stat.weightDelta > 0 ? "+" : "";
      const color = stat.weightDelta > 0 ? "#10b981" : stat.weightDelta < 0 ? "#ef4444" : "#999";
      deltaStr = `<span style="color: ${color}; font-weight: 600;"> ${sign}${stat.weightDelta.toFixed(1)}kg</span>`;
    }

    return `
      <div class="exercise-stat">
        <div class="exercise-name">${stat.exerciseName}</div>
        <div class="exercise-last-weight">
          <strong>${stat.lastWeight}kg</strong> ${trendEmoji}${deltaStr}
        </div>
        <div class="exercise-meta">
          ${stat.lastDate} • ${stat.sessionCount} sessions
        </div>
      </div>
    `;
  }

  private renderWeeklyVolume(): string {
    // Berechne diese Woche (Montag - Sonntag)
    const today = new Date();
    const currentDay = today.getDay();
    const diff = today.getDate() - currentDay + (currentDay === 0 ? -6 : 1); // adjust when day is Sunday
    const monday = new Date(today.setDate(diff));
    
    const weekStart = `${monday.getFullYear()}-${String(monday.getMonth() + 1).padStart(2, "0")}-${String(monday.getDate()).padStart(2, "0")}`;
    
    // Zähle Sets und Sessions diese Woche
    let totalSets = 0;
    let totalSessions = 0;
    
    this.sessions.forEach((session) => {
      const sessionDate = new Date(session.date);
      const mondayDate = new Date(weekStart);
      
      if (sessionDate >= mondayDate && sessionDate <= today) {
        totalSessions++;
        session.performances.forEach((perf) => {
          totalSets += perf.sets.length;
        });
      }
    });

    return `
      <div class="weekly-stats">
        <div class="weekly-stat">
          <div class="stat-emoji">💪</div>
          <div class="stat-data">
            <div class="stat-value">${totalSets}</div>
            <div class="stat-label">Total Sets</div>
          </div>
        </div>
        <div class="weekly-stat">
          <div class="stat-emoji">🏋️</div>
          <div class="stat-data">
            <div class="stat-value">${totalSessions}</div>
            <div class="stat-label">Trainings</div>
          </div>
        </div>
      </div>
    `;
  }

  private attachEventListeners(): void {
    document
      .getElementById("back-btn")
      ?.addEventListener("click", () => this.onBackCallback?.());
  }

  onBackCallback?: () => void;
}
