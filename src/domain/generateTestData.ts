/**
 * Test Data Generator - Simuliert ~30 Tage realistische Nutzung
 * NUR für lokale Tests - wird nicht in Production gebaut!
 *
 * Erzeugt:
 * - 20-25 Trainingstage (mit realistischen Lücken/Ausfällen)
 * - Variierende Set-Zahlen (5-20 Sets pro Tag)
 * - 30 Tage Ernährungsdaten
 * - Realistische Streaks & Best-Days
 */

import { TrainingSession, DailyNutrition, ExercisePerformance, CompletedSet } from "./types";
import { PLANS } from "./TrainingPlan";

/**
 * Generiere Test-Trainingssessions für die letzten N Tage
 */
export function generateTestTrainingSessions(daysBack: number = 30): TrainingSession[] {
  const sessions: TrainingSession[] = [];
  const today = new Date();

  // Pattern: 3 Tage trainieren, 1 Tag Ruhe (mit Variationen)
  const trainingPattern = [true, true, true, false];
  let patternIndex = 0;

  for (let i = daysBack; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = formatDate(date);

    // 80% Chance zu trainieren, wenn im Pattern, 100% mit leichten Ausfällen
    const shouldTrain = trainingPattern[patternIndex % trainingPattern.length];
    patternIndex++;

    if (!shouldTrain) continue;

    // Zufälliger Plan (60% A, 40% B)
    const planId = Math.random() < 0.6 ? ("A" as const) : ("B" as const);
    const plan = PLANS[planId];

    // Generiere Performances für alle Übungen im Plan
    const performances: ExercisePerformance[] = plan.exercises.map((exercise) => {
      // 2-5 Sätze pro Übung
      const setCount = Math.floor(Math.random() * 4) + 2;
      const sets: CompletedSet[] = [];

      for (let s = 0; s < setCount; s++) {
        sets.push({
          weight: Math.floor(Math.random() * 40) + 40, // 40-80 kg variierende Gewichte
          reps: Math.floor(Math.random() * 8) + 8, // 8-16 Reps
          timestamp: Date.now() - Math.random() * 3600000, // Zeitstempel im letzten Hour
        });
      }

      return {
        exerciseId: exercise.id,
        sets,
        feeling: (["good", "hard", null][Math.floor(Math.random() * 3)] as any) || null,
      };
    });

    sessions.push({
      id: `session_${planId}_${dateStr}`,
      planId,
      date: dateStr,
      performances,
      completedAt: Date.now(),
    });
  }

  return sessions;
}

/**
 * Generiere Test-Ernährungsdaten für die letzten N Tage
 */
export function generateTestNutritionData(daysBack: number = 30): DailyNutrition[] {
  const nutrition: DailyNutrition[] = [];
  const today = new Date();

  for (let i = daysBack; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = formatDate(date);

    // ~85% Chance dass jede Mahlzeit erfasst wurde
    nutrition.push({
      date: dateStr,
      meal1: Math.random() < 0.85,
      meal2: Math.random() < 0.85,
      shake: Math.random() < 0.80, // Shake öfter vergessen
      notes: "",
      loggedAt: Date.now(),
    });
  }

  return nutrition;
}

/**
 * Schreibe Test-Daten in localStorage
 */
export function writeTestDataToStorage(): void {
  const trainingSessions = generateTestTrainingSessions(30);
  const nutritionData = generateTestNutritionData(30);

  localStorage.setItem("fitness_training_sessions", JSON.stringify(trainingSessions));
  localStorage.setItem("fitness_nutrition", JSON.stringify(nutritionData));

  console.log("✅ Test-Daten geschrieben!");
  console.log(`   📋 ${trainingSessions.length} Trainingstage`);
  console.log(`   🍽️ ${nutritionData.length} Ernährungstage`);
}

/**
 * Lösche Test-Daten
 */
export function clearTestData(): void {
  localStorage.removeItem("fitness_training_sessions");
  localStorage.removeItem("fitness_nutrition");
  console.log("✅ Test-Daten gelöscht!");
}

/**
 * Helper: Formatiere Date zu YYYY-MM-DD
 */
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Test-Summary ausgeben (für DevTools Console)
 */
export function printTestDataSummary(): void {
  const sessions = JSON.parse(localStorage.getItem("fitness_training_sessions") || "[]");
  const nutrition = JSON.parse(localStorage.getItem("fitness_nutrition") || "[]");

  console.group("📊 Test-Daten Summary");
  console.log(`Total Trainingstage: ${sessions.length}`);

  if (sessions.length > 0) {
    const totalSets = sessions.reduce(
      (sum: number, s: TrainingSession) => sum + s.performances.reduce((psum, p) => psum + p.sets.length, 0),
      0
    );
    console.log(`Total Sets: ${totalSets}`);
    console.log(`Avg Sets/Tag: ${(totalSets / sessions.length).toFixed(1)}`);

    const plansCount = sessions.reduce((acc: any, s: TrainingSession) => {
      acc[s.planId] = (acc[s.planId] || 0) + 1;
      return acc;
    }, {});
    console.log(`Plan A: ${plansCount.A || 0}, Plan B: ${plansCount.B || 0}`);
  }

  if (nutrition.length > 0) {
    const meal1Count = nutrition.filter((n: DailyNutrition) => n.meal1).length;
    const meal2Count = nutrition.filter((n: DailyNutrition) => n.meal2).length;
    const shakeCount = nutrition.filter((n: DailyNutrition) => n.shake).length;
    console.log(`Meal 1: ${meal1Count}/${nutrition.length}`);
    console.log(`Meal 2: ${meal2Count}/${nutrition.length}`);
    console.log(`Shake: ${shakeCount}/${nutrition.length}`);
  }
  console.groupEnd();
}
