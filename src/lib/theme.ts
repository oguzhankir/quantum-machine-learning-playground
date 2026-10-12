export type Theme = 'light' | 'dark';
export const THEME_STORAGE_KEY = 'quantum-ml-playground:theme:v1';

const listeners = new Set<() => void>();
let currentTheme: Theme = 'light';
let preference: Theme | null = null;
let started = false;
let systemPreference: MediaQueryList;

function validTheme(value: string | null): Theme | null {
  return value === 'dark' || value === 'light' ? value : null;
}

function readPreference(): Theme | null {
  try {
    return validTheme(window.localStorage.getItem(THEME_STORAGE_KEY));
  } catch {
    return null;
  }
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', theme === 'dark' ? '#0c1422' : '#f5f7fb');
  if (currentTheme === theme) return;
  currentTheme = theme;
  listeners.forEach((listener) => listener());
}

export function initializeTheme() {
  if (started) return;
  started = true;
  systemPreference = window.matchMedia('(prefers-color-scheme: dark)');
  preference = readPreference();
  applyTheme(preference ?? (systemPreference.matches ? 'dark' : 'light'));
  systemPreference.addEventListener('change', (event) => {
    if (!preference) applyTheme(event.matches ? 'dark' : 'light');
  });
  window.addEventListener('storage', (event) => {
    if (event.key !== THEME_STORAGE_KEY && event.key !== null) return;
    preference = event.key === null ? null : validTheme(event.newValue);
    applyTheme(preference ?? (systemPreference.matches ? 'dark' : 'light'));
  });
}

export function getTheme(): Theme {
  return currentTheme;
}

export function subscribeTheme(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setTheme(theme: Theme) {
  preference = theme;
  applyTheme(theme);
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // The selected theme still works for this visit when storage is unavailable.
  }
}
