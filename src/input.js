export class InputHandler {
  constructor(game) {
    this.game = game;
    this.keyState = {};
    this.boundKeyHandler = this.handleKeyPress.bind(this);
  }

  setupEventListeners() {
    document.removeEventListener('keydown', this.boundKeyHandler);
    document.addEventListener('keydown', this.boundKeyHandler);
    this.setupKeyRepeat();
  }

  removeEventListeners() {
    document.removeEventListener('keydown', this.boundKeyHandler);
    this.keyState = {};
  }

  handleKeyPress(event) {
    if (this.game.isGameOver || this.game.isPaused) return;

    if (!this.keyState[event.key]) {
      this.keyState[event.key] = true;

      switch(event.key) {
        case 'ArrowLeft':
          this.game.movePiece(-1, 0);
          break;
        case 'ArrowRight':
          this.game.movePiece(1, 0);
          break;
        case 'ArrowDown':
          this.game.movePiece(0, 1);
          break;
        case ' ':
          this.game.rotatePiece();
          break;
        case 'p':
        case 'P':
          this.game.pauseGame();
          break;
      }
    }
    event.preventDefault();
  }

  setupKeyRepeat() {
    let repeatInterval = null;

    document.addEventListener('keydown', (event) => {
      if (['ArrowLeft', 'ArrowRight', 'ArrowDown'].includes(event.key)) {
        if (!repeatInterval) {
          this.handleKeyPress(event);
          repeatInterval = setInterval(() => {
            this.handleKeyPress(event);
          }, 100);
        }
      }
    });

    document.addEventListener('keyup', (event) => {
      this.keyState[event.key] = false;
      if (['ArrowLeft', 'ArrowRight', 'ArrowDown'].includes(event.key)) {
        clearInterval(repeatInterval);
        repeatInterval = null;
      }
    });
  }
}