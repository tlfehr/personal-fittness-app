# 💪 Fitness Tracker - Bedienungsanleitung

## 📱 Erste Schritte

### App starten
1. Öffne die App im Browser: `http://localhost:5173`
2. Du siehst das **Hauptmenü** mit 3 Optionen:
   - 🏋️ **Training starten**
   - 🍽️ **Ernährung**
   - 📊 **Fortschritt**

---

## 🏋️ Training tracken

### 1. Training beginnen
- Klick auf **"Training starten"**
- Du siehst zwei große **Plan-Karten** (A und B):
  - **Plan A (🏋️ Push Day)**: Bench Press, Incline Press, Tricep Dips
  - **Plan B (🦵 Leg Day)**: Squats, Deadlifts, Leg Press
- Klick auf **"Plan A Starten"** oder **"Plan B Starten"**

### 2. Set eingeben
Für jede Übung:

1. **Gewicht eingeben** (z.B. `80` für 80kg)
2. **Wiederholungen eingeben** (z.B. `10` für 10 Reps)
3. **"+ SET" Button klicken** oder **Enter drücken**

Die Eingaben werden automatisch gelöscht → du kannst direkt das nächste Set eingeben.

### 3. Gefühl bewerten (optional)
Nach jedem Set kannst du bewerten, wie sich die Übung anfühlte:
- **😊 Gut** – War leicht
- **💪 Hart** – War fordernd
- **😰 Zu hart** – War zu schwer

Einfach den Button klicken.

### 4. Zur nächsten Übung
- **"Weiter →"** Button = nächste Übung
- **"← Zurück"** Button = vorherige Übung
- **"✓ Fertig"** Button = Training beenden
- **🏠 Home Button** (oben links) = Sofort zu Home zurück (mit Sicherheitsabfrage)

> **Tipp:** Die App speichert automatisch nach jedem Set. Du brauchst nicht zu klicken!

---

## 🍽️ Ernährung tracken

### Tägliche Erfassung
Klick auf **"Ernährung"** im Hauptmenü.

Du siehst 3 große Buttons:
- **🥗 Mahlzeit 1**
- **🍖 Mahlzeit 2**
- **🥤 Shake**

### Mahlzeit erfassen
Klick einfach auf den Button → der Haken ✓ erscheint.
Klick nochmal → der Haken verschwindet (Du kannst es wieder rückgängig machen).

### Notizen (optional)
Unter den Buttons kannst du optional eine Notiz schreiben:
- "Viel Gemüse gegessen"
- "Snack: Nüsse"
- "Cheat Meal heute"

**Alles wird automatisch gespeichert.**

### Status
Oben siehst du:
- **Grün ✓** = Alle 3 Mahlzeiten erfasst für heute
- **Gelb ⏳** = Noch zu erfassen: ...

---

## 📊 Fortschritt ansehen

Klick auf **"Fortschritt"** im Hauptmenü.

### Gewichtprogression
Du siehst für jede Übung:
- **Letztes Gewicht:** z.B. "85kg"
- **Trend Indicator:**
  - **📈** = Gewicht gestiegen
  - **→** = Etwa gleich
  - **📉** = Gewicht gesunken
- **Letzte Session:** Wann war dein letztes Training?
- **Trainings-Count:** Wie viele Sessions mit dieser Übung?

### Wochenübersicht Ernährung
Du siehst, wie viele Tage diese Woche du deine Ernährung vollständig erfasst hast:
- `2 / 7` = 2 von 7 Tagen komplett
- Balken zeigt den Fortschritt

---

## 🔄 Daten verwalten

### Alle Daten löschen
1. Geh zum **Hauptmenü**
2. Scroll nach unten
3. Klick auf **"🗑️ Alle Daten löschen (DEBUG)"**
4. Bestätige die Sicherheitsfrage

⚠️ **Warnung:** Das kann nicht rückgängig gemacht werden!

### Daten exportieren
Deine Daten sind im Browser gespeichert (localStorage):
- Öffne **Browser DevTools** (F12 oder Cmd+Option+I)
- Geh zu **Application** → **Local Storage**
- Du siehst:
  - `fitness_training_sessions` = Alle Trainings
  - `fitness_nutrition` = Alle Mahlzeiten

Du kannst die Daten hier kopieren und sichern.

---

## ⚙️ Häufige Fragen

### Ist die App offline?
✅ **Ja!** Die App funktioniert 100% offline. Deine Daten werden lokal im Browser gespeichert. Du brauchst kein Internet.

### Meine Daten sind weg!
Wenn du deinen Browser-Cache leerst, werden die Daten gelöscht. Tipp: Vermeide **"Verlauf löschen"** oder **"Cookies und Site-Daten löschen"**.

### Kann ich auf meinem Handy trainieren?
✅ **Ja!** Öffne die App auf dem Handy im Browser. Sie ist One-Handed-Usable – perfekt für den Gym.

### Gibt es eine Sicherung?
❌ **Nein (noch nicht).** Deine Daten sind nur auf diesem Gerät. Später kommt Cloud-Backup (optional).

### Kann ich mehrere Trainingspläne haben?
❌ **Nicht jetzt.** MVP hat Plan A (Push) und Plan B (Leg). Später kannst du eigene Pläne erstellen.

### Warum keine Kalorienzählung?
❌ **Absicht.** Das MVP ist extrem minimal. Der Fokus liegt auf:
- Schnelle Trainings-Erfassung im Gym
- Einfache Mahlzeiten-Erfassung
- Grundlegende Progress-Anzeige

Kalorienzählung kommt später (wenn überhaupt).

---

## 💡 Tipps & Tricks

### Speed-Mode im Training
- Gib **Gewicht + Reps** ein
- Drück **Enter** statt "SET Button" zu klicken
- Super schnell zwischen Sets!

### Fortschritt verfolgen
- Öffne **"Fortschritt"** regelmäßig
- Schau auf die Trends (📈 = gut!)
- Schreib dir Ziele auf

### Ernährung tracken
- Nutze die **Notizen** für Besonderheiten
- Die App zeigt dir die **Wochenstatistik** → Motivation!

### Datenschutz
Deine Daten:
- ✅ Bleiben auf DEINEM Gerät
- ✅ Werden NICHT in die Cloud hochgeladen
- ✅ Werden NICHT mit anderen geteilt
- ❌ Sind NICHT verschlüsselt (lokal sicher, aber nicht gegen physischen Zugriff)

---

## 🆘 Probleme beheben

### App lädt nicht
1. Browser aktualisieren (Cmd+R oder F5)
2. Cache leeren: Cmd+Shift+Delete
3. Neuer Tab: http://localhost:5173

### Daten verschwunden
1. Browser DevTools öffnen (F12)
2. Application → Local Storage
3. Überprüfe, ob `fitness_training_sessions` noch da ist

### Button funktioniert nicht
Versuch mal, die Seite zu aktualisieren (Cmd+R / F5).

### Gewicht kann ich nicht eingeben
- Muss eine positive Zahl sein
- z.B. `80`, nicht `80kg`
- Dezimal: `80.5` oder `80,5` (beide gehen)

---

## 📞 Support

Diese App ist ein MVP (Minimum Viable Product) mit minimalen Features.

Bekannte Limitationen:
- Keine User-Accounts
- Keine Cloud-Sync
- Keine Bilderkennung
- Keine KI-Vorschläge
- Nur 2 vordefinierte Pläne

**Geplant für später:**
- Eigene Trainingspläne erstellen
- Cloud-Backup
- Fortgeschrittene Analytics
- Mobile App (iOS/Android)

---

## 🎯 Zusammenfassung: Dein Workflow

### Gym-Szenario
```
1. Handy-App öffnen
2. "Training starten" 
3. Wähle Plan A oder B (große Karten mit Übersicht)
4. Für jede Übung:
   - Gewicht eingeben
   - Reps eingeben
   - Enter drücken
   - Nächstes Set
   - Nach letztem Set: Gefühl bewerten
   - "Weiter" zur nächsten Übung
5. "✓ Fertig" klicken → zurück zu Home
   (oder 🏠 Button anklicken für schnellen Exit)
```

### Ernährung-Szenario
```
1. Home → "Ernährung"
2. Mahlzeit 1 essen → Button klicken ✓
3. Mahlzeit 2 essen → Button klicken ✓
4. Shake trinken → Button klicken ✓
5. Optionale Notiz hinzufügen
6. Zurück Home
```

### Progress-Check
```
1. Home → "Fortschritt"
2. Schau dein letztes Gewicht pro Übung
3. Trend-Pfeile sehen (📈 = steigend!)
4. Wochenstatistik Ernährung
```

---

**Viel Erfolg mit deinem Training! 💪**

*Version 1.0 | Januar 2025*
