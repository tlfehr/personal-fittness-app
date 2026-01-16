/**
 * Vordefinierte Trainingspläne A und B
 * Mit echten Übungen und aktuellen Gewichten
 */

import { TrainingPlan } from "./types";

export const TRAINING_PLAN_A: TrainingPlan = {
  id: "A",
  name: "Plan A",
  exercises: [
    {
      id: "leg_press",
      name: "Beinpresse",
      targetSets: 4,
      restSeconds: 120,
    },
    {
      id: "chest_press",
      name: "Brustpresse",
      targetSets: 4,
      restSeconds: 120,
    },
    {
      id: "lat_pulldown",
      name: "Latzug",
      targetSets: 3,
      restSeconds: 90,
    },
    {
      id: "leg_curl",
      name: "Beinbeuger",
      targetSets: 2,
      restSeconds: 90,
    },
    {
      id: "shoulder_press",
      name: "Schulterpresse",
      targetSets: 3,
      restSeconds: 90,
    },
    {
      id: "butterfly",
      name: "Butterfly",
      targetSets: 3,
      restSeconds: 90,
    },
    {
      id: "tricep_machine",
      name: "Trizeps",
      targetSets: 2,
      restSeconds: 60,
    },
    {
      id: "ab_machine",
      name: "Bauchmaschine",
      targetSets: 2,
      restSeconds: 60,
    },
  ],
  createdAt: Date.now(),
};

export const TRAINING_PLAN_B: TrainingPlan = {
  id: "B",
  name: "Plan B",
  exercises: [
    {
      id: "leg_curl_b",
      name: "Beinbeuger",
      targetSets: 3,
      restSeconds: 90,
    },
    {
      id: "leg_extension",
      name: "Beinstrecker",
      targetSets: 3,
      restSeconds: 90,
    },
    {
      id: "rowing_machine",
      name: "Rudermaschine",
      targetSets: 3,
      restSeconds: 120,
    },
    {
      id: "chest_press_b",
      name: "Brustpresse",
      targetSets: 3,
      restSeconds: 120,
    },
    {
      id: "shoulder_press_b",
      name: "Schulterpresse",
      targetSets: 3,
      restSeconds: 90,
    },
    {
      id: "reverse_butterfly",
      name: "Reverse Butterfly",
      targetSets: 3,
      restSeconds: 90,
    },
    {
      id: "bicep_machine",
      name: "Bizepsmaschine",
      targetSets: 3,
      restSeconds: 60,
    },
    {
      id: "ab_machine_b",
      name: "Bauchmaschine",
      targetSets: 3,
      restSeconds: 60,
    },
  ],
  createdAt: Date.now(),
};

export const PLANS = {
  A: TRAINING_PLAN_A,
  B: TRAINING_PLAN_B,
};
