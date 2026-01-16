# 💪 Personal Fitness & Nutrition Tracker MVP

**Offline-First, Mobile-Friendly, Minimal & Fast**

Eine extrem einfache, schnelle App zum Tracken von:
- 📋 Trainingspläne A & B (fest vordefiniert)
- 🏋️ Gewicht + Wiederholungen pro Satz
- 😊 Subjektives Gefühl pro Übung
- 🍽️ Tägliche Ernährung (3 Items: Mahlzeit 1, Mahlzeit 2, Shake)
- 📊 Minimale Progress-Anzeige

**Kein Login • Keine Cloud • Offline-Ready • Zero Runtime Dependencies**

---

## 🚀 Quick Start

```bash
# Install
npm install

# Dev (mit Hot Reload)
npm run dev

# Build
npm run build
```

Öffnet sich automatisch auf `http://localhost:5173`

---

## 📱 Features

### Training
- ✅ 2 feste Trainingspläne (A: Push Day, B: Leg Day)
- ✅ Pro Übung: Gewicht, Wiederholungen, Gefühl (gut/hart/zu hart)
- ✅ Letztes Gewicht & Trend-Indicator
- ✅ Autosave nach jedem Set

### Ernährung
- ✅ 3 Toggle-Buttons pro Tag (Mahlzeit 1, 2, Shake)
- ✅ Optional: Notizen
- ✅ Wochenübersicht (% Tage komplett erfasst)
- ✅ Autosave nach jedem Klick

### Datapersistence
- ✅ 100% localStorage (Offline-Ready)
- ✅ Kein Server nötig
- ✅ Alle Daten im Browser gespeichert

---

## 🏗️ Architecture

**Clean Domain-Driven Design** mit 3 Layern:

| Layer | Zweck | Beispiel |
|-------|-------|---------|
| **domain/** | Pure Business Logic (keine I/O) | `Training.ts`, `Nutrition.ts` |
| **infrastructure/** | Persistenz & Externe APIs | `LocalStorageRepository.ts` |
| **app/** | UI & State Management | `AppState.ts`, `TrainingScreen.ts` |

**Keine Abhängigkeiten**: Vanilla TypeScript + DOM APIs

---

## 📝 Datenmodell

### TrainingSession
```typescript
{
  id: "session_A_2025-01-16",
  planId: "A",
  date: "2025-01-16",
  performances: [
    {
      exerciseId: "bench_press",
      sets: [
        { weight: 100, reps: 8, timestamp: ... },
        { weight: 100, reps: 7, timestamp: ... }
      ],
      feeling: "good"
    }
  ]
}
```

### DailyNutrition
```typescript
{
  date: "2025-01-16",
  meal1: true,
  meal2: true,
  shake: false,
  notes: "Snack: 2 Äpfel",
  loggedAt: ...
}
```

---

## 🎯 UX Prinzipien

1. **One Screen = One Task** → Nicht überfordert
2. **Keine Pflichtfelder** → Flexibel
3. **Autosave überall** → Kein "Speichern"-Button
4. **Gym-Ready** → Mit einer Hand bedienbar
5. **Minimal** → Schnell & fokussiert

---

## 🔧 Development

### Projektstruktur
```
src/
├── domain/              ← Business Logic (Pure Functions)
│   ├── types.ts
│   ├── Training.ts
│   ├── Nutrition.ts
│   └── TrainingPlan.ts
├── infrastructure/      ← Persistenz
│   └── storage/LocalStorageRepository.ts
└── app/                 ← UI & State
    ├── AppState.ts
    ├── UIManager.ts
    ├── TrainingScreen.ts
    ├── NutritionScreen.ts
    └── StatsScreen.ts

public/
├── index.html
└── styles.css
```

### Wichtige Commands

```bash
npm run dev       # Entwicklungsserver (Hot Reload)
npm run build     # Production Build → dist/
npm run preview   # Build lokal testen
npm test          # Tests laufen (Setup-ready)
```

### Debugging

**Browser DevTools → Application → Local Storage**:
- `fitness_training_sessions` → alle Trainingsdaten
- `fitness_nutrition` → alle Ernährungsdaten

**Console**:
```javascript
window.__app.appState.currentTrainingSession
window.__app.appState.currentNutrition
```

---

## 🔮 Zukünftige Erweiterungen

### Phase 2
- [ ] User-definierte Trainingspläne
- [ ] Mehrere Profiles
- [ ] Data Export (JSON)
- [ ] Progressive Web App (Installierbar)

### Phase 3+
- [ ] Cloud Sync
- [ ] Kalorie-Tracking
- [ ] Foto-Integration
- [ ] AI-Coaching
- [ ] Social Features

**Architektur ist bereit für diese Erweiterungen** – clean separation of concerns!

---

## 📊 Tech Stack

- **Language**: TypeScript
- **Bundler**: Vite
- **Testing**: Vitest (configured, not needed yet)
- **UI**: Vanilla DOM (no framework)
- **Persistence**: localStorage
- **Styling**: CSS (no preprocessor)

**Bundle Size**: ~5-10KB

---

## 📖 Für AI Coding Agents

Lese `.github/copilot-instructions.md` für detaillierte Architektur, Muster und Erweiterungspunkte!

---

## 🤝 Contributing

Für Features/Bugfixes:

1. Änderungen gehören in den richtigen Layer (`domain/`, `infrastructure/`, `app/`)
2. Domain-Functions müssen pure bleiben (keine I/O)
3. AppState-Actions müssen autosave + notify
4. Tests für Domain-Logic schreiben

---

## 📄 License

MIT (Persönliches Projekt)

---

**Built with ❤️ | Offline-First | MVP Ready | 2025**
