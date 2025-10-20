import { InputHandler } from './input.js';
import { Renderer } from './render.js';
import { recordScore, showLeaderboardOverlay, hideLeaderboardOverlay } from './leaderboard.js';
import { GAME_SETTINGS, PIECE_SET } from './config.js';
import { getActivePalette } from './theme.js';

export class TetrisGame {
  constructor(options = {}) {
    this.canvas = document.getElementById('game-board');
    this.ctx = this.canvas.getContext('2d');

    const settings = { ...GAME_SETTINGS, ...options };

    this.BLOCK_SIZE = settings.blockSize;
    this.BOARD_WIDTH = settings.boardWidth;
    this.BOARD_HEIGHT = settings.boardHeight;
    this.baseDropSpeed = settings.baseDropSpeed;
    this.minDropSpeed = settings.minDropSpeed;
    this.dropAcceleration = settings.dropAcceleration;
    this.linePoints = settings.linePoints;

    this.board = this.createEmptyBoard();
    this.currentPiece = null;
    this.nextPieceTemplate = null;
    this.score = 0;
    this.level = 1;
    this.lines = 0;
    this.isGameOver = false;
    this.isPaused = false;
    this.lastDropTime = 0;
    this.dropSpeed = this.baseDropSpeed;
  this.animationFrameId = null;

    this.colors = [...getActivePalette()];
    this.pieceTemplates = PIECE_SET;

    this.renderer = new Renderer(this);
    this.inputHandler = new InputHandler(this);

    this.themeChangeHandler = () => {
      this.updatePalette(getActivePalette());
    };
    window.addEventListener('tetris-theme-change', this.themeChangeHandler);

    this.initializeGame();
  }

  initializeGame() {
    console.log("🔄 Инициализация игры...");
    this.prepareNextPiece();
    this.createNewPiece();
    this.startGameLoop();
    this.inputHandler.setupEventListeners();
    this.updateUI();
  }

  createEmptyBoard() {
    return Array.from({ length: this.BOARD_HEIGHT }, () => Array(this.BOARD_WIDTH).fill(0));
  }

  getRandomPieceTemplate() {
    const index = Math.floor(Math.random() * this.pieceTemplates.length);
    return this.pieceTemplates[index];
  }

  cloneMatrix(matrix) {
    return matrix.map((row) => [...row]);
  }

  prepareNextPiece() {
    this.nextPieceTemplate = this.getRandomPieceTemplate();
    if (this.renderer) {
      this.renderer.renderNextPiece(this.nextPieceTemplate);
    }
  }

  createNewPiece() {
    const template = this.nextPieceTemplate ?? this.getRandomPieceTemplate();
    const shape = this.cloneMatrix(template.matrix);

    this.currentPiece = {
      shape,
      color: template.colorIndex,
      x: Math.floor((this.BOARD_WIDTH - shape[0].length) / 2),
      y: 0
    };

    this.prepareNextPiece();
  }

  startGameLoop() {
    console.log("🎮 Старт игрового цикла!");
    this.lastDropTime = performance.now();
    this.gameLoop();
  }

  gameLoop = (currentTime = 0) => {
    if (!this.isPaused) {
      if (currentTime - this.lastDropTime > this.dropSpeed) {
        this.dropPiece();
        this.lastDropTime = currentTime;
      }
    }

    this.renderer.render();

    if (this.isGameOver) {
      this.renderer.renderGameOver();
      return;
    }

    this.animationFrameId = requestAnimationFrame(this.gameLoop);
  }

  dropPiece() {
    if (!this.movePiece(0, 1)) {
      this.lockPiece();
      this.checkLines();
      this.createNewPiece();

      if (!this.isValidMove(this.currentPiece.x, this.currentPiece.y)) {
        this.gameOver();
      }
    }
    this.updateUI();
  }

  movePiece(dx, dy) {
    if (this.isValidMove(this.currentPiece.x + dx, this.currentPiece.y + dy)) {
      this.currentPiece.x += dx;
      this.currentPiece.y += dy;
      return true;
    }
    return false;
  }

  rotatePiece() {
    const originalShape = this.currentPiece.shape;
    const rotated = originalShape[0].map((_, index) =>
      originalShape.map(row => row[index]).reverse()
    );

    this.currentPiece.shape = rotated;

    if (!this.isValidMove(this.currentPiece.x, this.currentPiece.y)) {
      const kicks = [-1, 1, -2, 2];
      for (const kick of kicks) {
        if (this.isValidMove(this.currentPiece.x + kick, this.currentPiece.y)) {
          this.currentPiece.x += kick;
          return true;
        }
      }
      this.currentPiece.shape = originalShape;
      return false;
    }
    return true;
  }

  isValidMove(newX, newY) {
    const shape = this.currentPiece.shape;

    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] !== 0) {
          const boardX = newX + x;
          const boardY = newY + y;

          if (boardX < 0 || boardX >= this.BOARD_WIDTH ||
            boardY >= this.BOARD_HEIGHT ||
            (boardY >= 0 && this.board[boardY][boardX] !== 0)) {
            return false;
          }
        }
      }
    }
    return true;
  }

  lockPiece() {
    const shape = this.currentPiece.shape;

    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] !== 0) {
          const boardY = this.currentPiece.y + y;
          const boardX = this.currentPiece.x + x;

          if (boardY >= 0) {
            this.board[boardY][boardX] = this.currentPiece.color;
          }
        }
      }
    }
  }

  checkLines() {
    let linesCleared = 0;

    for (let y = this.BOARD_HEIGHT - 1; y >= 0; y--) {
      if (this.board[y].every(cell => cell !== 0)) {
        this.board.splice(y, 1);
        this.board.unshift(Array(this.BOARD_WIDTH).fill(0));
        linesCleared++;
        y++;
      }
    }

    if (linesCleared > 0) {
      this.updateScore(linesCleared);
    }
  }

  updateScore(linesCleared) {
    const basePoints = this.linePoints[linesCleared] ?? 0;
    this.score += basePoints * this.level;
    this.lines += linesCleared;
    this.level = Math.floor(this.lines / 10) + 1;
    this.dropSpeed = Math.max(
      this.minDropSpeed,
      this.baseDropSpeed - (this.level - 1) * this.dropAcceleration
    );
    console.log(`🎉 Очищено линий: ${linesCleared}! Счет: ${this.score}`);
  }

  gameOver() {
    if (this.isGameOver) {
      return;
    }

    this.isGameOver = true;
    console.log("💀 Игра окончена! Финальный счет:", this.score);
    recordScore(this.score);
    showLeaderboardOverlay({
      statusMessage: `Вы проиграли! Ваш счет: ${this.score}`
    });
  }

  updateUI() {
    const scoreEl = document.getElementById('score');
    const levelEl = document.getElementById('level');
    const linesEl = document.getElementById('lines');

    if (scoreEl) scoreEl.textContent = `Счет: ${this.score}`;
    if (levelEl) levelEl.textContent = `Уровень: ${this.level}`;
    if (linesEl) linesEl.textContent = `Линии: ${this.lines}`;
  }

  pauseGame() {
    this.isPaused = !this.isPaused;
    console.log(this.isPaused ? '⏸️ Пауза' : '▶️ Продолжить');
  }

  restartGame() {
    hideLeaderboardOverlay();

    this.stopLoop();
    this.board = this.createEmptyBoard();
    this.currentPiece = null;
    this.nextPieceTemplate = null;
    this.score = 0;
    this.level = 1;
    this.lines = 0;
    this.isGameOver = false;
    this.isPaused = false;
    this.dropSpeed = this.baseDropSpeed;

    this.initializeGame();
  }

  stopGame() {
    this.stopLoop();
    this.inputHandler.removeEventListeners();
    window.removeEventListener('tetris-theme-change', this.themeChangeHandler);
  }

  stopLoop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  updatePalette(colors) {
    if (!Array.isArray(colors) || colors.length === 0) return;
    this.colors = [...colors];
    this.renderer.rebuildBlocks();
  }
}