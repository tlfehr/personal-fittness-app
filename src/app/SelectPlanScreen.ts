/**
 * Select Plan Screen - Visuelle Plan-Auswahl
 * Ersetzt den Browser-Dialog mit einer App-wie UI
 */

import { TrainingPlanId } from "../domain/types";
import { PLANS } from "../domain/TrainingPlan";

export class SelectPlanScreen {
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  render(): void {
    this.container.innerHTML = "";

    const planA = PLANS.A;
    const planB = PLANS.B;

    const html = `
      <div class="screen select-plan-screen">
        <div class="screen-header">
          <h1>💪 Trainingsplan wählen</h1>
          <p>Welcher Plan ist heute dran?</p>
        </div>

        <div class="plan-cards">
          <!-- PLAN A -->
          <div class="plan-card" id="plan-a-card">
            <div class="plan-header">
              <div class="plan-title">Plan A</div>
              <div class="plan-emoji">🏋️</div>
            </div>
            <div class="plan-name">${planA.name}</div>
            <div class="plan-description">Push Fokus</div>
            
            <div class="plan-exercises">
              ${planA.exercises
                .map(
                  (ex) =>
                    `<div class="exercise-item">• ${ex.name} (${ex.targetSets} Sets)</div>`
                )
                .join("")}
            </div>

            <button class="btn btn-primary" id="btn-plan-a">
              Plan A Starten
            </button>
          </div>

          <!-- PLAN B -->
          <div class="plan-card" id="plan-b-card">
            <div class="plan-header">
              <div class="plan-title">Plan B</div>
              <div class="plan-emoji">🦵</div>
            </div>
            <div class="plan-name">${planB.name}</div>
            <div class="plan-description">Bein Fokus</div>
            
            <div class="plan-exercises">
              ${planB.exercises
                .map(
                  (ex) =>
                    `<div class="exercise-item">• ${ex.name} (${ex.targetSets} Sets)</div>`
                )
                .join("")}
            </div>

            <button class="btn btn-primary" id="btn-plan-b">
              Plan B Starten
            </button>
          </div>
        </div>

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
      .getElementById("btn-plan-a")
      ?.addEventListener("click", () => this.onSelectPlan("A"));

    document
      .getElementById("btn-plan-b")
      ?.addEventListener("click", () => this.onSelectPlan("B"));

    document
      .getElementById("back-btn")
      ?.addEventListener("click", () => this.onBackCallback?.());
  }

  private onSelectPlan(planId: TrainingPlanId): void {
    this.onPlanSelectedCallback?.(planId);
  }

  // Callbacks
  onPlanSelectedCallback?: (planId: TrainingPlanId) => void;
  onBackCallback?: () => void;
}
