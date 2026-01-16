# 💪 Fitness Tracker MVP - AI Agent Instructions

## Projekt-Übersicht

**Personal Fitness & Nutrition Tracker** - Offline-first MVP mit lokalem Storage (keine Cloud).

**Stack**: TypeScript + Vanilla DOM + localStorage | **Architektur**: Clean Domain-Driven Design | **Fokus**: Minimale UX, ein Screen = eine Aufgabe

---

## 🎯 Big Picture Architecture

### Layer-Struktur

```
src/
├── domain/          ← Pure Business Logic (ZERO Abhängigkeiten)
│   ├── types.ts              → All Entity Interfaces
│   ├── Training.ts           → Training Logic (no I/O)
│   ├── Nutrition.ts          → Nutrition Logic (no I/O)
│   └── TrainingPlan.ts       → Hardcoded Plan Fixtures (A & B)
│
├── infrastructure/  ← I/O & Persistance
│   └── storage/
│       └── LocalStorageRepository.ts  → Alle localStorage Operationen hier
│
└── app/             ← UI & State Management
    ├── AppState.ts          → Central State + Listeners (Simple Reactive)
    ├── UIManager.ts         → Navigation & Screen Orchestration
    ├── TrainingScreen.ts    → Training UI Component
    ├── NutritionScreen.ts   → Nutrition UI Component
    └── StatsScreen.ts       → Analytics UI Component
```

### Datenfluss

```
User Interaction (Click/Input)
    ↓
UI Component (TrainingScreen, etc.)
    ↓
AppState.addSet() / toggleMeal() etc. (State Mutation)
    ↓
Repository.saveTrainingSession() (Autosave to localStorage)
    ↓
AppState.notify() → All Listeners (Trigger Re-renders)
    ↓
Components Re-render with New State
```

### Kritische Designentscheidungen

| Bereich | Ansatz | Warum |
|---------|--------|-------|
| State Management | Simple Listener Pattern (kein Redux) | MVP-Komplexität reduzieren, keine externe Abhängigkeiten |
| Domain Logic | Pure Functions nur in `domain/` | Testbar, Framework-unabhängig, erweiterbar |
| Persistenz | localStorage, kein IndexedDB (yet) | Einfach, genug für MVP, später upgrade-bar |
| UI Framework | Vanilla DOM, keine React/Vue | Schneller Build, Zero Runtime, ideal für Gym-Szenarien |
| Trainingspläne | Hardcoded (A & B) | MVP scope, später User-Plans hinzufügen |
| Authentifizierung | Keine | Offline-first MVP |

---

## 📝 Domänenmodell (Entities)

### Training Domain

```typescript
TrainingSession {
  id: string              // "session_A_2025-01-16"
  planId: "A" | "B"       // Welcher Plan
  date: string            // YYYY-MM-DD
  performances: ExercisePerformance[]
  completedAt: number     // timestamp
}

ExercisePerformance {
  exerciseId: string      // z.B. "bench_press"
  sets: CompletedSet[]    // Alle absolvierten Sätze
  feeling: "good" | "hard" | "too_hard" | null
}

CompletedSet {
  weight: number
  reps: number
  timestamp: number
}

TrainingPlan {
  id: "A" | "B"
  name: string
  exercises: Exercise[]   // Vordefinierte Übungen
}

Exercise {
  id: string
  name: string
  targetSets: number
  restSeconds: number
}
```

### Nutrition Domain

```typescript
DailyNutrition {
  date: string        // YYYY-MM-DD
  meal1: boolean      // Mahlzeit 1 erfasst?
  meal2: boolean      // Mahlzeit 2 erfasst?
  shake: boolean      // Shake erfasst?
  notes: string       // Optional
  loggedAt: number    // timestamp
}
```

### Stats Domain

```typescript
ExerciseStats {
  exerciseId: string
  exerciseName: string
  lastWeight: number | null
  lastDate: string | null
  trend: "up" | "stable" | "down"
  sessionCount: number
}
```

---

## 🔧 Kritische Developer Workflows

### 1. **Starte Entwicklungsserver**

```bash
npm install
npm run dev
```

Öffnet auf `http://localhost:5173`, Hot Module Reloading enabled.

### 2. **Build für Production**

```bash
npm run build
```

Output: `dist/` (statische HTML/JS/CSS)

### 3. **Testing** (zukünftig)

```bash
npm test
```

Tests sollten im `domain/` Layer konzentriert sein (pure functions).

### 4. **Data Reset** (Debug)

In Home Screen: Button "🗑️ Alle Daten löschen" oder:
```typescript
appState.resetAll() // Clears localStorage + resets UI
```

---

## 🏗️ Code Patterns & Konventionen

### Domain Functions (Pure Functions)

```typescript
// ✅ GOOD - keine Seiteneffekte, deterministisch
export function addSetToExercise(
  performance: ExercisePerformance,
  weight: number,
  reps: number
): ExercisePerformance {
  return { ...performance, sets: [...performance.sets, { weight, reps, timestamp: Date.now() }] };
}

// ❌ AVOID - I/O, Seiteneffekte
export async function addSet(exerciseId: string) {
  const session = await fetch(`/api/sessions/${id}`);
  // ...
}
```

### AppState Actions (Synchron, Autosave)

```typescript
// Jede Action speichert SOFORT zu localStorage
toggleMeal1(): void {
  if (!this.currentNutrition) return;
  this.currentNutrition = toggleMeal1(this.currentNutrition);
  this.saveNutrition(); // ← Autosave!
  this.notify();        // ← Trigger Re-renders
}
```

### Repository Pattern (Persistenz-Abstraction)

```typescript
// Alle localStorage Zugriffe hier konzentriert
// Leicht austauschbar gegen IndexedDB/SQLite später
class LocalStorageRepository {
  saveTrainingSession(session: TrainingSession): void {
    const all = this.getAllTrainingSessions();
    // ... upsert logic
    localStorage.setItem(KEY, JSON.stringify(all));
  }
}
```

### UI Components (Callbacks)

```typescript
// Screen kennt sich selbst, delegiert Actions zu AppState via Callbacks
class TrainingScreen {
  render(): void {
    // ...
    screen.onAddSetCallback = (exerciseId, weight, reps) => {
      appState.addSet(exerciseId, weight, reps); // ← Delegate
      screen.render(); // Re-render nach State Change
    };
  }
}
```

---

## 🔄 Typische Erweiterungen

### Feature: Mehrere Trainingspläne

**Aktuell**: Pläne hardcoded in `TrainingPlan.ts`

**Zukünftig**:
1. `TrainingPlan` mit `customPlans` Map erweitern
2. Repository: `saveCustomPlan(plan: TrainingPlan)`
3. UI: Plan Editor Screen hinzufügen
4. **Änderungen**: nur in `domain/`, `infrastructure/`, `app/` (keine Kern-Logik-Änderungen)

### Feature: Cloud Sync

**Aktuell**: Nur localStorage

**Zukünftig**:
1. `CloudStorageRepository extends BaseRepository`
2. `AppState` mit Sync-Status updaten
3. Konflikte-Handling (offline-first merge)
4. **Änderungen**: neue `infrastructure/storage/CloudStorageRepository.ts`, `AppState` erweitern

### Feature: AI-basierte Prognoseverbesserung

**Integration Point**: `ExerciseStats` in `domain/Training.ts`
- `calculateWeightTrend()` kann von einfachen Vergleichen zu ML-Modell erweitert werden
- Domänenlogik bleibt getrennt von AI-Feature

---

## 📱 UI/UX Prinzipien (WICHTIG!)

1. **One Screen = One Task**
   - Home → Training → einzelne Übung
   - Kein "alles auf einer Seite"

2. **Keine Pflichtfelder**
   - Trainingsgewicht optional
   - Ernährungskommentar optional
   - Gefühl optional

3. **Schnelle Eingabe im Gym**
   - Gewicht + Reps + Enter = Set hinzufügen
   - Toggle-Button für Mahlzeiten
   - Minimale Clicks

4. **Autosave überall**
   - Kein "Speichern"-Button
   - Jede Änderung wird sofort persistiert

---

## 🐛 Debugging Tipps

### localStorage Inspektion

Browser DevTools → Application → Local Storage:
- `fitness_training_sessions` → Array von Sessions
- `fitness_nutrition` → Array von Daily Nutrition Entries

### Direkter State Access

In DevTools Console:
```javascript
window.__app                    // UIManager Instanz
window.__app.appState           // AppState
appState.currentTrainingSession // Aktuelle Session
repository.getAllTrainingSessions() // Alle Historischen Daten
```

### Clear All Data (Hard Reset)

```javascript
localStorage.clear()
location.reload()
```

---

## 📦 Abhängigkeiten (Minimal!)

- **TypeScript**: Type safety
- **Vite**: Build/Dev server
- **Vitest**: Testing (zukünftig)

**Zero Runtime Dependencies** - reiner DOM-Manipulation!

---

## ⚡ Performance Notes

- **Bundle Size**: ~5-10KB (unminified TypeScript → JS)
- **localStorage Limit**: 5-10MB (mehr als genug für ein Jahr Trainings/Ernährung)
- **UI Renders**: Component-Level, nur betroffene Screens re-render
- **Gym-Usable**: Works offline, no network latency

---

## 🎓 Für Neue AI-Agenten

### Vor dem Coding:

1. Lese `domain/` zuerst → verstehe Business-Rules
2. Dann `infrastructure/` → verstehe Persistenz
3. Dann `app/` → verstehe UI/State-Flow
4. **Wichtig**: Domain-Logik bleibt REIN (keine I/O, keine Framework-Abhängigkeiten)

### Code-Review Checklist:

- [ ] Domain-Functions sind pure (kein `localStorage`, kein `fetch`)
- [ ] `AppState` Actions speichern sofort + notifyen
- [ ] Neue Features folgen Layer-Architektur
- [ ] UI bleibt simpel (kein Overengineering)
- [ ] localStorage Keys in `STORAGE_KEYS` Map dokumentiert

---

## 🚀 MVP Scope (Was IST gemacht)

✅ Trainingssessions mit festen Plänen (A & B)  
✅ Gewicht/Reps/Gefühl Pro Übung  
✅ Tägliche Ernährungserfassung (3 Items)  
✅ Letztes Gewicht + Trend Anzeige  
✅ Offline-Persistenz (localStorage)  
✅ Mobile-Friendly UI (One-Handed Usable)

## 🔮 Phase 2+ (Nicht im MVP)

- [ ] Multiple Custom Training Plans
- [ ] Kalorie-Tracking
- [ ] Chat/AI-Coaching
- [ ] Cloud Sync
- [ ] User Accounts
- [ ] Photo Recognition
- [ ] Social Sharing

---

**Letzte Aktualisierung**: Januar 16, 2025
**Maintainer**: Initial Build für MVP
