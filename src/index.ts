/**
 * App Entry Point
 * Initialisiert UI und bindet alles zusammen
 */

import { AppUI } from "./app/UIManager";

// Initialisiere die App
const app = new AppUI("app");

// Für Debugging im DevTools
(window as any).__app = app;

console.log("💪 Fitness Tracker MVP initialized");
console.log("Access app via window.__app");
