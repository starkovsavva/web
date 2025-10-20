const LEADERBOARD_STORAGE_KEY = 'tetrisLeaderboard';
const MAX_LEADERBOARD_ENTRIES = 50;
const DEFAULT_LEADERBOARD_TITLE = 'Таблица лидеров';

function getOverlayElement() {
  return document.getElementById('leaderboardOverlay');
}

function getToggleButton() {
  return document.getElementById('leaderboardToggle');
}

function getListElement() {
  return document.getElementById('leaderboardList');
}

function getCloseButton() {
  return document.getElementById('leaderboardClose');
}

function getTitleElement() {
  return document.getElementById('leaderboardTitle');
}

function getStatusElement() {
  return document.getElementById('leaderboardStatus');
}

export function getLeaderboard() {
  try {
    const raw = localStorage.getItem(LEADERBOARD_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed
      .filter((entry) => entry && typeof entry.username === 'string')
      .map((entry) => ({
        username: String(entry.username),
        score: Number.isFinite(Number(entry.score)) ? Number(entry.score) : 0,
        date: typeof entry.date === 'string' ? entry.date : ''
      }));
  } catch (error) {
    console.warn('Не удалось прочитать таблицу лидеров:', error);
    return [];
  }
}

function saveLeaderboard(entries) {
  try {
    localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(entries));
  } catch (error) {
    console.warn('Не удалось сохранить таблицу лидеров:', error);
  }
}

function formatDate(date) {
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function toggleLeaderboardButton(shouldShow) {
  const button = getToggleButton();
  if (!button) return;

  if (shouldShow) {
    button.classList.remove('hidden');
  } else {
    button.classList.add('hidden');
  }
}

function setLeaderboardTitle(title = DEFAULT_LEADERBOARD_TITLE) {
  const titleElement = getTitleElement();
  if (!titleElement) return;
  titleElement.textContent = title;
}

function setLeaderboardStatus(message) {
  const statusElement = getStatusElement();
  if (!statusElement) return;

  if (message) {
    statusElement.textContent = message;
    statusElement.classList.remove('hidden');
  } else {
    statusElement.textContent = '';
    statusElement.classList.add('hidden');
  }
}

export function refreshLeaderboardUI(highlightUsername) {
  const listElement = getListElement();
  if (!listElement) return;

  const entries = getLeaderboard();
  const currentUser = highlightUsername ?? localStorage.getItem('tetris.username');

  if (!entries.length) {
    listElement.innerHTML = '<p>Пока нет результатов</p>';
    toggleLeaderboardButton(false);
    setLeaderboardTitle(DEFAULT_LEADERBOARD_TITLE);
    setLeaderboardStatus('');
    return;
  }

  const sortedEntries = [...entries].sort((a, b) => b.score - a.score);
  const leaderboardHTML = sortedEntries.map((entry, index) => {
    const isCurrent = entry.username === currentUser;
    const dateLabel = entry.date ?? '';
    const safeName = escapeHtml(entry.username);
    const safeScore = Number.isFinite(entry.score) ? entry.score : 0;
    return `
      <div class="leaderboard-item ${isCurrent ? 'current' : ''}">
        <span class="leaderboard-rank">#${index + 1}</span>
        <span class="leaderboard-name">${safeName}</span>
        <span class="leaderboard-score">${safeScore}</span>
      </div>
      ${dateLabel ? `<div class="leaderboard-date">${escapeHtml(dateLabel)}</div>` : ''}
    `;
  }).join('');

  listElement.innerHTML = leaderboardHTML;
  toggleLeaderboardButton(true);
}

export function showLeaderboardOverlay({ title, statusMessage } = {}) {
  refreshLeaderboardUI();
  if (title) {
    setLeaderboardTitle(title);
  } else {
    setLeaderboardTitle(DEFAULT_LEADERBOARD_TITLE);
  }

  setLeaderboardStatus(statusMessage);

  const overlay = getOverlayElement();
  if (!overlay) return;
  overlay.classList.remove('hidden');
}

export function hideLeaderboardOverlay() {
  const overlay = getOverlayElement();
  if (!overlay) return;
  overlay.classList.add('hidden');
  setLeaderboardTitle(DEFAULT_LEADERBOARD_TITLE);
  setLeaderboardStatus('');
}

export function initLeaderboardUI() {
  const overlay = getOverlayElement();
  const closeButton = getCloseButton();
  const toggleButton = getToggleButton();

  setLeaderboardTitle(DEFAULT_LEADERBOARD_TITLE);
  setLeaderboardStatus('');

  if (toggleButton) {
    toggleButton.addEventListener('click', () => {
      showLeaderboardOverlay();
    });
  }

  if (closeButton) {
    closeButton.addEventListener('click', () => {
      hideLeaderboardOverlay();
    });
  }

  if (overlay) {
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) {
        hideLeaderboardOverlay();
      }
    });
  }

  refreshLeaderboardUI();
}

export function recordScore(score) {
  const username = localStorage.getItem('tetris.username');
  if (!username) {
    return;
  }

  const entries = getLeaderboard();
  const now = new Date();
  const normalizedScore = Number.isFinite(Number(score)) ? Math.max(0, Math.floor(Number(score))) : 0;

  const updatedEntries = [
    ...entries,
    {
      username,
      score: normalizedScore,
      date: formatDate(now)
    }
  ]
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_LEADERBOARD_ENTRIES);

  saveLeaderboard(updatedEntries);
  refreshLeaderboardUI(username);
}
