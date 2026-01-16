/**
 * Vordefinierte Trainingspläne A und B
 * In späteren Versionen: von Backend laden oder via UI erstellen
 */

import { TrainingPlan } from "./types";

export const TRAINING_PLAN_A: TrainingPlan = {
  id: "A",
  name: "Push Day",
  exercises: [
    {
      id: "bench_press",
      name: "Bench Press",
      targetSets: 4,
      restSeconds: 120,
    },
    {
      id: "incline_press",
      name: "Incline Press",
      targetSets: 3,
      restSeconds: 90,
    },
    {
      id: "tricep_dips",
      name: "Tricep Dips",
      targetSets: 3,
      restSeconds: 60,
    },
  ],
  createdAt: Date.now(),
};

export const TRAINING_PLAN_B: TrainingPlan = {
  id: "B",
  name: "Leg Day",
  exercises: [
    {
      id: "squats",
      name: "Squats",
      targetSets: 4,
      restSeconds: 180,
    },
    {
      id: "deadlifts",
      name: "Deadlifts",
      targetSets: 3,
      restSeconds: 180,
    },
    {
      id: "leg_press",
      name: "Leg Press",
      targetSets: 3,
      restSeconds: 90,
    },
  ],
  createdAt: Date.now(),
};

export const PLANS = {
  A: TRAINING_PLAN_A,
  B: TRAINING_PLAN_B,
};
