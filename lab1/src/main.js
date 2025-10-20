import { TetrisGame } from './game.js';
import { initLoginPage, addChangeUserButton } from './login.js';
import { initLeaderboardUI } from './leaderboard.js';
import { initTheme, initThemeSwitcher } from './theme.js';

// Глобальная функция для запуска игры после логина
document.addEventListener('DOMContentLoaded', function() {
  initTheme();
  initLeaderboardUI();
  initLoginPage();
  addChangeUserButton();

  const themeSelectors = document.querySelectorAll('[data-theme-selector]');
  initThemeSwitcher(themeSelectors);

  // Проверяем если пользователь уже авторизован - запускаем игру
  const username = localStorage.getItem('tetris.username');
  if (username) {
    console.log("👤 Пользователь уже авторизован, запускаем игру...");
    startGameAfterLogin();
  }
});

window.startGameAfterLogin = function() {
  console.log("🎮 Запуск игры после авторизации...");
  if (window.game) {
    window.game.stopGame();
  }
  window.game = new TetrisGame();
};
