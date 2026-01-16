/**
 * DateUtils - Timezone-aware Date Handling
 * WICHTIG: Nutzt LOKALE Zeitzone, nicht UTC!
 */

/**
 * Gibt das heutige Datum im Format YYYY-MM-DD zurück
 * WICHTIG: Nutzt die Zeitzone des Geräts (z.B. Europe/Berlin), nicht UTC
 */
export function getTodayString(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Konvertiert ein Date-Objekt zu YYYY-MM-DD (lokale Zeitzone)
 */
export function dateToString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Konvertiert YYYY-MM-DD String zu Date (lokale Zeitzone, Mitternacht)
 * WICHTIG: Setzt Uhrzeit auf 00:00:00 in lokaler Zeit
 */
export function stringToDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day, 0, 0, 0, 0);
}

/**
 * Berechnet die Differenz zwischen zwei Tagen (in Tagen)
 * Nutzt lokale Zeitzone
 */
export function daysBetween(dateStr1: string, dateStr2: string): number {
  const date1 = stringToDate(dateStr1);
  const date2 = stringToDate(dateStr2);
  const diffMs = Math.abs(date2.getTime() - date1.getTime());
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Gibt den vorherigen Tag zurück (YYYY-MM-DD, lokale Zeitzone)
 */
export function getPreviousDayString(dateStr: string): string {
  const date = stringToDate(dateStr);
  date.setDate(date.getDate() - 1);
  return dateToString(date);
}

/**
 * Gibt den nächsten Tag zurück (YYYY-MM-DD, lokale Zeitzone)
 */
export function getNextDayString(dateStr: string): string {
  const date = stringToDate(dateStr);
  date.setDate(date.getDate() + 1);
  return dateToString(date);
}

/**
 * Prüft, ob zwei Daten aufeinanderfolgend sind
 * z.B. "2026-01-15" und "2026-01-16" sind consecutive
 */
export function isConsecutiveDay(prevDateStr: string, nextDateStr: string): boolean {
  const nextDay = getNextDayString(prevDateStr);
  return nextDay === nextDateStr;
}
