import { TetrisGame } from './game.js';
import { initLoginPage, hideLoginForm, showGameContent, addChangeUserButton } from './login.js';

// Глобальная функция для запуска игры после логина
document.addEventListener('DOMContentLoaded', function() {
  initLoginPage();
  addChangeUserButton();

  // Проверяем если пользователь уже авторизован - запускаем игру
  const username = localStorage.getItem('tetris.username');
  if (username) {
    console.log("👤 Пользователь уже авторизован, запускаем игру...");
    hideLoginForm();
    showGameContent();
    startGameAfterLogin();
  }
});

window.startGameAfterLogin = function() {
  console.log("🎮 Запуск игры после авторизации...");
  window.game = new TetrisGame();
};
