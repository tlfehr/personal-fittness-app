/**
 * Nutrition Screen - Einfachste Erfassung
 * Nur: 3 Toggle-Buttons + Notizen
 * Ein Klick pro Mahlzeit = Done
 */

import { DailyNutrition } from "../domain/types";
import { isNutritionComplete } from "../domain/Nutrition";

export class NutritionScreen {
  private container: HTMLElement;
  private nutrition: DailyNutrition;

  constructor(container: HTMLElement, nutrition: DailyNutrition) {
    this.container = container;
    this.nutrition = nutrition;
  }

  render(): void {
    this.container.innerHTML = "";

    const isComplete = isNutritionComplete(this.nutrition);
    const completionPercent = [
      this.nutrition.meal1,
      this.nutrition.meal2,
      this.nutrition.shake,
    ].filter(Boolean).length;

    const html = `
      <div class="screen nutrition-screen">
        <!-- HEADER -->
        <div class="screen-header">
          <h1>🍽️ Ernährung - ${this.nutrition.date}</h1>
          <div class="completion-indicator">
            ${completionPercent}/3 erfasst ${isComplete ? "✓" : ""}
          </div>
        </div>

        <!-- MEAL TOGGLES -->
        <div class="meal-toggle-section">
          <button 
            id="meal1-toggle" 
            class="meal-button ${this.nutrition.meal1 ? "active" : ""}"
          >
            <div class="meal-icon">🥗</div>
            <div class="meal-label">Mahlzeit 1</div>
            <div class="meal-status">${this.nutrition.meal1 ? "✓" : "○"}</div>
          </button>

          <button 
            id="meal2-toggle" 
            class="meal-button ${this.nutrition.meal2 ? "active" : ""}"
          >
            <div class="meal-icon">🍖</div>
            <div class="meal-label">Mahlzeit 2</div>
            <div class="meal-status">${this.nutrition.meal2 ? "✓" : "○"}</div>
          </button>

          <button 
            id="shake-toggle" 
            class="meal-button ${this.nutrition.shake ? "active" : ""}"
          >
            <div class="meal-icon">🥤</div>
            <div class="meal-label">Shake</div>
            <div class="meal-status">${this.nutrition.shake ? "✓" : "○"}</div>
          </button>
        </div>

        <!-- NOTES -->
        <div class="notes-section">
          <label for="nutrition-notes">Notizen (optional)</label>
          <textarea 
            id="nutrition-notes" 
            placeholder="z.B. Snacks, spezielle Gedanken..."
            rows="3"
          >${this.nutrition.notes}</textarea>
        </div>

        <!-- STATUS -->
        <div class="status-box ${isComplete ? "complete" : ""}">
          ${
            isComplete
              ? "<strong>✓ Tag vollständig erfasst!</strong>"
              : "<strong>⏳ Noch zu erfassen:</strong>" +
                (!this.nutrition.meal1 ? " Mahlzeit 1," : "") +
                (!this.nutrition.meal2 ? " Mahlzeit 2," : "") +
                (!this.nutrition.shake ? " Shake" : "")
          }
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

  private attachEventListeners(): void {
    document
      .getElementById("meal1-toggle")
      ?.addEventListener("click", () => this.onToggleMeal1());

    document
      .getElementById("meal2-toggle")
      ?.addEventListener("click", () => this.onToggleMeal2());

    document
      .getElementById("shake-toggle")
      ?.addEventListener("click", () => this.onToggleShake());

    document
      .getElementById("nutrition-notes")
      ?.addEventListener("input", (e) => {
        this.onUpdateNotes((e.target as HTMLTextAreaElement).value);
      });

    document
      .getElementById("back-btn")
      ?.addEventListener("click", () => this.onBackCallback?.());
  }

  private onToggleMeal1(): void {
    this.onToggleMeal1Callback?.();
  }

  private onToggleMeal2(): void {
    this.onToggleMeal2Callback?.();
  }

  private onToggleShake(): void {
    this.onToggleShakeCallback?.();
  }

  private onUpdateNotes(notes: string): void {
    this.onUpdateNotesCallback?.(notes);
  }

  // Callbacks
  onToggleMeal1Callback?: () => void;
  onToggleMeal2Callback?: () => void;
  onToggleShakeCallback?: () => void;
  onUpdateNotesCallback?: (notes: string) => void;
  onBackCallback?: () => void;
}
