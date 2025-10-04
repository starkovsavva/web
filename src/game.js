import { InputHandler } from './input.js';
import { Renderer } from './render.js';

export class TetrisGame {
  constructor() {
    this.canvas = document.getElementById('game-board');
    this.ctx = this.canvas.getContext('2d');

    this.BLOCK_SIZE = 30;
    this.BOARD_WIDTH = 10;
    this.BOARD_HEIGHT = 20;

    this.board = Array(this.BOARD_HEIGHT).fill().map(() => Array(this.BOARD_WIDTH).fill(0));
    this.currentPiece = null;
    this.nextPiece = null;
    this.score = 0;
    this.level = 1;
    this.lines = 0;
    this.isGameOver = false;
    this.isPaused = false;
    this.dropInterval = null;
    this.lastDropTime = 0;
    this.dropSpeed = 1000;

    this.colors = [
      '#000000', '#00FFFF', '#FFFF00', '#800080',
      '#0000FF', '#FFA500', '#00FF00', '#FF0000'
    ];

    this.pieces = [
      { shape: [[1,1,1,1]], color: 1 },
      { shape: [[2,2],[2,2]], color: 2 },
      { shape: [[0,3,0],[3,3,3]], color: 3 },
      { shape: [[4,0,0],[4,4,4]], color: 4 },
      { shape: [[0,0,5],[5,5,5]], color: 5 },
      { shape: [[0,6,6],[6,6,0]], color: 6 },
      { shape: [[7,7,0],[0,7,7]], color: 7 }
    ];

    this.renderer = new Renderer(this);
    this.inputHandler = new InputHandler(this);

    this.initializeGame();
  }

  initializeGame() {
    console.log("🔄 Инициализация игры...");
    this.createNewPiece();
    this.startGameLoop();
    this.inputHandler.setupEventListeners();
    this.updateUI();
  }

  createNewPiece() {
    const piece = this.nextPiece || this.pieces[Math.floor(Math.random() * this.pieces.length)];
    this.currentPiece = {
      shape: piece.shape.map(row => [...row]),
      color: piece.color,
      x: Math.floor((this.BOARD_WIDTH - piece.shape[0].length) / 2),
      y: 0
    };
    this.generateNextPiece();
  }

  generateNextPiece() {
    this.nextPiece = this.pieces[Math.floor(Math.random() * this.pieces.length)];
  }

  startGameLoop() {
    console.log("🎮 Старт игрового цикла!");
    this.lastDropTime = performance.now();
    this.gameLoop();
  }

  gameLoop = (currentTime = 0) => {
    if (this.isGameOver) {
      this.renderer.renderGameOver();
      return;
    }

    if (!this.isPaused) {
      if (currentTime - this.lastDropTime > this.dropSpeed) {
        this.dropPiece();
        this.lastDropTime = currentTime;
      }
      this.renderer.render();
    }

    requestAnimationFrame(this.gameLoop);
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
    const linePoints = [0, 40, 100, 300, 1200];
    this.score += linePoints[linesCleared] * this.level;
    this.lines += linesCleared;
    this.level = Math.floor(this.lines / 10) + 1;
    this.dropSpeed = Math.max(50, 1000 - (this.level - 1) * 100);
    console.log(`🎉 Очищено линий: ${linesCleared}! Счет: ${this.score}`);
  }

  gameOver() {
    this.isGameOver = true;
    console.log("💀 Игра окончена! Финальный счет:", this.score);
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
    if (this.dropInterval) {
      clearInterval(this.dropInterval);
    }

    this.board = Array(this.BOARD_HEIGHT).fill().map(() => Array(this.BOARD_WIDTH).fill(0));
    this.currentPiece = null;
    this.nextPiece = null;
    this.score = 0;
    this.level = 1;
    this.lines = 0;
    this.isGameOver = false;
    this.isPaused = false;
    this.dropSpeed = 1000;

    this.initializeGame();
  }

  stopGame() {
    if (this.gameLoop) {
      cancelAnimationFrame(this.gameLoop);
    }
    this.inputHandler.removeEventListeners();
  }
}