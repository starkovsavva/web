import { refreshLeaderboardUI, hideLeaderboardOverlay } from './leaderboard.js';

const selectors = {
  loginContainer: '#loginContainer',
  gameContainer: '#gameContainer',
  username: '#username',
  loginForm: '#loginForm'
};

const elements = {};

function cacheElements() {
  if (Object.keys(elements).length) return elements;

  elements.loginContainer = document.querySelector(selectors.loginContainer);
  elements.gameContainer = document.querySelector(selectors.gameContainer);
  elements.usernameInput = document.querySelector(selectors.username);
  elements.loginForm = document.querySelector(selectors.loginForm);

  return elements;
}

function show(element) {
  element?.classList.remove('hidden');
}

function hide(element) {
  element?.classList.add('hidden');
}

function setUsername(value = '') {
  if (!elements.usernameInput) return;
  elements.usernameInput.value = value;
}

function focusUsername() {
  elements.usernameInput?.focus({ preventScroll: true });
}

function getStoredUsername() {
  try {
    return localStorage.getItem('tetris.username');
  } catch {
    return null;
  }
}

function storeUsername(username) {
  try {
    localStorage.setItem('tetris.username', username);
  } catch (error) {
    console.warn('Не удалось сохранить имя пользователя:', error);
  }
}

function clearStoredUsername() {
  try {
    localStorage.removeItem('tetris.username');
  } catch (error) {
    console.warn('Не удалось удалить имя пользователя:', error);
  }
}

function handleLoginSuccess(username) {
  hide(elements.loginContainer);
  show(elements.gameContainer);
  refreshLeaderboardUI(username);
  window.startGameAfterLogin();
}

function setupLoginForm() {
  if (!elements.loginForm || elements.loginForm.dataset.initialized) return;

  elements.loginForm.dataset.initialized = 'true';

  elements.loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const username = elements.usernameInput?.value.trim();
    if (!username) {
      focusUsername();
      if (elements.usernameInput) {
        elements.usernameInput.placeholder = 'Пожалуйста, введите имя!';
      }
      return;
    }

    storeUsername(username);
    handleLoginSuccess(username);
  });
}

function showLoginScreen() {
  show(elements.loginContainer);
  hide(elements.gameContainer);
  setUsername('');
  focusUsername();
  refreshLeaderboardUI();
  hideLeaderboardOverlay();
}

function showGameScreen(username) {
  setUsername(username);
  hide(elements.loginContainer);
  show(elements.gameContainer);
  refreshLeaderboardUI(username);
}

export function addChangeUserButton() {
  if (document.querySelector('.btn-change-user')) return;

  const changeUserBtn = document.createElement('button');
  changeUserBtn.type = 'button';
  changeUserBtn.textContent = '👤 Сменить пользователя';
  changeUserBtn.className = 'btn btn-secondary btn-floating btn-change-user';

  changeUserBtn.addEventListener('click', () => {
    if (window.game) {
      window.game.stopGame();
      window.game = null;
    }

    clearStoredUsername();
    showLoginScreen();
  });

  document.body.append(changeUserBtn);
}

export function initLoginPage() {
  cacheElements();
  setupLoginForm();

  const savedUsername = getStoredUsername();

  if (savedUsername) {
    showGameScreen(savedUsername);
  } else {
    showLoginScreen();
  }
}