import { THEMES, DEFAULT_THEME, THEME_STORAGE_KEY } from './config.js';

let activeThemeName = DEFAULT_THEME;
const registeredThemeSelects = new Set();
let syncListenerRegistered = false;

function persistTheme(themeName) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, themeName);
  } catch (error) {
    console.warn('Не удалось сохранить тему:', error);
  }
}

function restoreTheme() {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY);
  } catch (error) {
    console.warn('Не удалось прочитать тему:', error);
    return null;
  }
}

function setCssVariables(theme) {
  const root = document.documentElement;
  Object.entries(theme.variables).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value);
  });
}

export function applyTheme(themeName = DEFAULT_THEME) {
  const fallback = THEMES[DEFAULT_THEME];
  const theme = THEMES[themeName] ?? fallback;

  setCssVariables(theme);
  activeThemeName = themeName in THEMES ? themeName : DEFAULT_THEME;
  persistTheme(activeThemeName);

  window.dispatchEvent(new CustomEvent('tetris-theme-change', {
    detail: { themeName: activeThemeName }
  }));

  return activeThemeName;
}

export function initTheme() {
  const stored = restoreTheme();
  applyTheme(stored ?? DEFAULT_THEME);
  return activeThemeName;
}

export function getActiveTheme() {
  return activeThemeName;
}

export function getAvailableThemes() {
  return Object.entries(THEMES).map(([value, config]) => ({
    value,
    label: config.label
  }));
}

export function getActivePalette() {
  return THEMES[activeThemeName].tetrominoColors;
}

function normalizeSelects(targets) {
  if (!targets) return [];

  if (targets instanceof HTMLSelectElement) {
    return [targets];
  }

  if (typeof targets[Symbol.iterator] === 'function') {
    return Array.from(targets).filter((node) => node instanceof HTMLSelectElement);
  }

  return [];
}

function syncSelectValues(themeName) {
  registeredThemeSelects.forEach((select) => {
    if (!select.isConnected) {
      registeredThemeSelects.delete(select);
      return;
    }

    select.value = themeName;
  });
}

function handleThemeChange(event) {
  syncSelectValues(event.detail.themeName);
}

function handleSelectChange(event) {
  applyTheme(event.target.value);
}

export function initThemeSwitcher(targets) {
  const selects = normalizeSelects(targets);
  if (!selects.length) return;

  const themes = getAvailableThemes();
  const currentTheme = getActiveTheme();

  selects.forEach((select) => {
    if (!(select instanceof HTMLSelectElement)) return;

    if (select.dataset.themeSwitcherInitialized === 'true') {
      registeredThemeSelects.add(select);
      select.value = currentTheme;
      return;
    }

    select.innerHTML = '';
    themes.forEach(({ value, label }) => {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = label;
      select.append(option);
    });

    select.value = currentTheme;
    select.dataset.themeSwitcherInitialized = 'true';
    select.addEventListener('change', handleSelectChange);
    registeredThemeSelects.add(select);
  });

  syncSelectValues(currentTheme);

  if (!syncListenerRegistered) {
    window.addEventListener('tetris-theme-change', handleThemeChange);
    syncListenerRegistered = true;
  }
}
