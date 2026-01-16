/**
 * App UI Manager - Navigation zwischen Screens
 * Home Screen → Select Plan → Training / Nutrition / Stats
 */

import { appState } from "./AppState";
import { repository } from "../infrastructure/storage/LocalStorageRepository";
import { SelectPlanScreen } from "./SelectPlanScreen";
import { TrainingScreen } from "./TrainingScreen";
import { NutritionScreen } from "./NutritionScreen";
import { StatsScreen } from "./StatsScreen";
import { HistoryScreen } from "./HistoryScreen";
import { PLANS } from "../domain/TrainingPlan";
import { getWeekDates, calculateNutritionWeekStats } from "../domain/Nutrition";

type ScreenName = "home" | "select-plan" | "training" | "nutrition" | "stats" | "history";

export class AppUI {
  private container: HTMLElement;
  private currentScreen: ScreenName = "home";
  private unsubscribe: (() => void) | null = null;

  constructor(containerId: string) {
    const el = document.getElementById(containerId);
    if (!el) throw new Error(`Container #${containerId} not found`);
    this.container = el;

    // Subscribe zu State-Änderungen
    this.unsubscribe = appState.subscribe(() => this.render());

    this.render();
  }

  /**
   * Navigiere zu einem Screen
   */
  navigate(screen: ScreenName): void {
    this.currentScreen = screen;
    this.render();
  }

  /**
   * Main Render - delegiere zu Screen-Komponenten
   */
  private render(): void {
    switch (this.currentScreen) {
      case "home":
        this.renderHomeScreen();
        break;
      case "select-plan":
        this.renderSelectPlanScreen();
        break;
      case "training":
        this.renderTrainingScreen();
        break;
      case "nutrition":
        this.renderNutritionScreen();
        break;
      case "stats":
        this.renderStatsScreen();
        break;
      case "history":
        this.renderHistoryScreen();
        break;
    }
  }

  /**
   * Home Screen - Hauptmenü
   */
  private renderHomeScreen(): void {
    this.container.innerHTML = `
      <div class="screen home-screen">
        <div class="screen-header">
          <h1>💪 Fitness Tracker</h1>
          <p>Offline MVP</p>
        </div>

        <div class="home-menu">
          <button id="btn-training" class="menu-button">
            <div class="icon">🏋️</div>
            <div class="label">Training starten</div>
          </button>

          <button id="btn-nutrition" class="menu-button">
            <div class="icon">🍽️</div>
            <div class="label">Ernährung</div>
          </button>

          <button id="btn-stats" class="menu-button">
            <div class="icon">📊</div>
            <div class="label">Fortschritt</div>
          </button>

          <button id="btn-calendar" class="menu-button">
            <div class="icon">📋</div>
            <div class="label">Verlauf</div>
          </button>
        </div>

        <div class="today-status">
          ${this.renderTodayStatus()}
        </div>

        <div class="debug-section" style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #ccc; font-size: 0.8rem;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-bottom: 0.5rem;">
            <button id="btn-test-data" class="btn" style="background: #4CAF50; color: white;">
              ✅ Test-Daten (30d)
            </button>
            <button id="btn-clear-test" class="btn" style="background: #FF9800; color: white;">
              🧹 Test löschen
            </button>
          </div>
          <button id="btn-reset" class="btn btn-danger" style="width: 100%;">
            🗑️ Alle Daten löschen (DEBUG)
          </button>
        </div>
      </div>
    `;

    document
      .getElementById("btn-training")
      ?.addEventListener("click", () => this.navigate("select-plan"));

    document
      .getElementById("btn-nutrition")
      ?.addEventListener("click", () => this.navigate("nutrition"));

    document
      .getElementById("btn-stats")
      ?.addEventListener("click", () => this.navigate("stats"));

    document
      .getElementById("btn-calendar")
      ?.addEventListener("click", () => this.navigate("history"));

    document
      .getElementById("btn-test-data")
      ?.addEventListener("click", async () => {
        const { writeTestDataToStorage, printTestDataSummary } = await import(
          "../domain/generateTestData"
        );
        writeTestDataToStorage();
        printTestDataSummary();
        // Reload AppState mit neuen Daten
        location.reload();
      });

    document
      .getElementById("btn-clear-test")
      ?.addEventListener("click", async () => {
        const { clearTestData } = await import("../domain/generateTestData");
        clearTestData();
        location.reload();
      });

    document
      .getElementById("btn-reset")
      ?.addEventListener("click", () => {
        if (confirm("Wirklich alle Daten löschen?")) {
          appState.resetAll();
          this.render();
        }
      });
  }

  /**
   * Select Plan Screen
   */
  private renderSelectPlanScreen(): void {
    const screen = new SelectPlanScreen(this.container);

    screen.onPlanSelectedCallback = (planId) => {
      appState.startTrainingSession(planId);
      this.navigate("training");
    };

    screen.onBackCallback = () => {
      this.navigate("home");
    };

    screen.render();
  }

  /**
   * Training Screen
   */
  private renderTrainingScreen(): void {
    if (!appState.currentTrainingSession) {
      this.navigate("home");
      return;
    }

    const screen = new TrainingScreen(
      this.container,
      appState.currentTrainingSession,
      repository
    );

    screen.onAddSetCallback = (exerciseId, weight, reps) => {
      appState.addSet(exerciseId, weight, reps);
      screen.render(); // Re-render nach Änderung
    };

    screen.onSetFeelingCallback = (exerciseId, feeling) => {
      appState.setExerciseFeeling(exerciseId, feeling);
      screen.render();
    };

    screen.onFinishCallback = () => {
      this.navigate("home");
    };

    screen.onHomeCallback = () => {
      this.navigate("home");
    };

    screen.render();
  }

  /**
   * Nutrition Screen
   */
  private renderNutritionScreen(): void {
    if (!appState.currentNutrition) {
      this.navigate("home");
      return;
    }

    const screen = new NutritionScreen(this.container, appState.currentNutrition);

    screen.onToggleMeal1Callback = () => {
      appState.toggleMeal1();
    };

    screen.onToggleMeal2Callback = () => {
      appState.toggleMeal2();
    };

    screen.onToggleShakeCallback = () => {
      appState.toggleShake();
    };

    screen.onUpdateNotesCallback = (notes) => {
      appState.setNutritionNotes(notes);
    };

    screen.onBackCallback = () => {
      this.navigate("home");
    };

    screen.render();
  }

  /**
   * Stats Screen
   */
  private renderStatsScreen(): void {
    // Sammle alle Exercise Stats
    const allExercises = new Set<string>();
    Object.values(PLANS).forEach((plan) => {
      plan.exercises.forEach((ex) => allExercises.add(ex.id));
    });

    const exerciseStats = Array.from(allExercises).map((exId) =>
      repository.getExerciseStats(exId)
    );

    // Berechne Ernährungsstats für diese Woche
    const date = new Date();
    const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    const weekDates = getWeekDates(today);
    const weekNutrition = repository.getNutritionForWeek(today);
    const nutritionStats = calculateNutritionWeekStats(weekNutrition);

    const allSessions = repository.getAllTrainingSessions();
    const screen = new StatsScreen(this.container, exerciseStats, nutritionStats, allSessions);
    screen.onBackCallback = () => this.navigate("home");
    screen.render();
  }

  /**
   * History Screen (Training + Ernährung Logs)
   */
  private renderHistoryScreen(): void {
    const allSessions = repository.getAllTrainingSessions();
    const allNutrition = repository.getAllNutrition();
    const screen = new HistoryScreen(this.container, allSessions, allNutrition);
    screen.onBackCallback = () => this.navigate("home");
    screen.render();
  }

  /**
   * Heute Status im Home Screen
   */
  private renderTodayStatus(): string {
    const training = appState.currentTrainingSession;
    const nutrition = appState.currentNutrition;

    let html = '<div class="status-items">';

    if (training) {
      const setsCount = training.performances.reduce(
        (sum, p) => sum + p.sets.length,
        0
      );
      html += `<div class="status-item">🏋️ ${setsCount} Sets absolv.</div>`;
    }

    if (nutrition) {
      const count = [nutrition.meal1, nutrition.meal2, nutrition.shake].filter(
        Boolean
      ).length;
      html += `<div class="status-item">🍽️ ${count}/3 Mahlzeiten</div>`;
    }

    html += "</div>";
    return html;
  }

  /**
   * Cleanup
   */
  destroy(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}
