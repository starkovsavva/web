// Функция для загрузки сохраненного имени
export function loadSavedUsername() {
  const usernameInput = document.getElementById('username');
  const savedUsername = localStorage.getItem('tetris.username');

  if (savedUsername && usernameInput) {
    usernameInput.value = savedUsername;
    usernameInput.placeholder = `Рады снова видеть, ${savedUsername}!`;
    hideLoginForm();
    updateUserStats();
  }
}

// Функция для обработки отправки формы
export function setupLoginForm() {
  const form = document.getElementById('loginForm');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const usernameInput = document.getElementById('username');
    const username = usernameInput.value.trim();

    if (username) {
      localStorage.setItem('tetris.username', username);
      hideLoginForm();
      showGameContent();
      window.startGameAfterLogin(); // Запускаем игру!
    } else {
      usernameInput.focus();
      usernameInput.placeholder = 'Пожалуйста, введите имя!';
    }
  });
}

// Функция скрытия формы логина
export function hideLoginForm() {
  const loginContainer = document.querySelector('.login-container');
  if (loginContainer) loginContainer.style.display = 'none';
}

// Функция показа формы логина
export function showLoginForm() {
  const loginContainer = document.querySelector('.login-container');
  if (loginContainer) loginContainer.style.display = 'block';
}

// Функция показа основного контента
export function showGameContent() {
  const features = document.querySelector('.features');
  if (features) features.style.display = 'block';

}

// Функция обновления статистики пользователя
function updateUserStats() {
  const username = localStorage.getItem('tetris.username');
  const leaderboard = getLeaderboard();
  const userStats = leaderboard.filter(entry => entry.username === username);

  if (userStats.length > 0) {
    const bestScore = Math.max(...userStats.map(entry => entry.score));
    const totalGames = userStats.length;

    const statsHTML = `
            <h3>Ваша статистика (${username}):</h3>
            <ul>
                <li>Лучший результат: <strong>${bestScore}</strong></li>
                <li>Всего игр: <strong>${totalGames}</strong></li>
                <li>Последняя игра: <strong>${userStats[0].date}</strong></li>
                <li>Место в рейтинге: <strong>#${getUserRank(username)}</strong></li>
            </ul>
        `;

    const features = document.querySelector('.features');
    if (features) features.innerHTML = statsHTML;
  }
  updateLeaderboardDisplay();

}
function updateLeaderboardDisplay() {
  const leaderboard = getLeaderboard();
  const leaderboardList = document.getElementById('leaderboardList');
  const leaderboardContainer = document.querySelector('.leaderboard');
  const currentUser = localStorage.getItem('tetris.username');

  if (!leaderboardList) return;

  if (leaderboard.length === 0) {
    leaderboardList.innerHTML = '<p>Пока нет результатов</p>';
    return;
  }

  // Сортируем по убыванию очков
  const sortedLeaderboard = [...leaderboard].sort((a, b) => b.score - a.score);

  const leaderboardHTML = sortedLeaderboard.map((entry, index) => `
    <div class="leaderboard-item ${entry.username === currentUser ? 'current' : ''}">
      <span class="leaderboard-rank">#${index + 1}</span>
      <span class="leaderboard-name">${entry.username}</span>
      <span class="leaderboard-score">${entry.score}</span>
    </div>
  `).join('');

  leaderboardList.innerHTML = leaderboardHTML;

  // Показываем контейнер лидерборда
  if (leaderboardContainer) {
    leaderboardContainer.classList.remove('hidden');
    leaderboardContainer.classList.add('visible');
  }
}

// Функция получения ранга пользователя
function getUserRank(username) {
  const leaderboard = getLeaderboard();
  const userEntry = leaderboard.find(entry => entry.username === username);
  return userEntry ? leaderboard.indexOf(userEntry) + 1 : 'Нет в рейтинге';
}

// Функции для работы с лидербордом
function getLeaderboard() {
  const leaderboard = localStorage.getItem('tetrisLeaderboard');
  return leaderboard ? JSON.parse(leaderboard) : [];
}

// Добавляем кнопку "Сменить пользователя"
export function addChangeUserButton() {
  const changeUserBtn = document.createElement('button');
  changeUserBtn.textContent = '👤 Сменить пользователя';
  changeUserBtn.className = 'btn-change-user';
  changeUserBtn.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 10px 15px;
        background: #ff9800;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        z-index: 1000;
    `;

  changeUserBtn.addEventListener('click', function() {
    if (window.game) {
      window.game.stopGame();
      window.game = null;
    }
    localStorage.removeItem('tetris.username');
    showLoginForm();
    const features = document.querySelector('.features');
    if (features) features.style.display = 'none';
  });

  document.body.appendChild(changeUserBtn);
}

// Основная функция инициализации
export function initLoginPage() {
  loadSavedUsername();
  setupLoginForm();
}