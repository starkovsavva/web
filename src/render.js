export class Renderer {
  constructor(game) {
    this.game = game;
    this.preRenderedBlocks = this.preRenderBlocks();
  }

  preRenderBlocks() {
    const blocks = {};
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = this.game.BLOCK_SIZE;
    tempCanvas.height = this.game.BLOCK_SIZE;
    const tempCtx = tempCanvas.getContext('2d');

    this.game.colors.forEach((color, index) => {
      if (index === 0) return;

      tempCtx.fillStyle = color;
      tempCtx.fillRect(0, 0, this.game.BLOCK_SIZE, this.game.BLOCK_SIZE);

      const gradient = tempCtx.createLinearGradient(0, 0, this.game.BLOCK_SIZE, this.game.BLOCK_SIZE);
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, this.darkenColor(color, 0.3));
      tempCtx.fillStyle = gradient;
      tempCtx.fillRect(2, 2, this.game.BLOCK_SIZE - 4, this.game.BLOCK_SIZE - 4);

      tempCtx.strokeStyle = '#FFF';
      tempCtx.lineWidth = 2;
      tempCtx.strokeRect(0, 0, this.game.BLOCK_SIZE, this.game.BLOCK_SIZE);

      blocks[index] = new Image();
      blocks[index].src = tempCanvas.toDataURL();
    });

    return blocks;
  }

  darkenColor(color, amount) {
    const hex = color.replace('#', '');
    const num = parseInt(hex, 16);
    const amt = Math.round(2.55 * amount * 100);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  }

  render() {
    this.game.ctx.fillStyle = '#000000';
    this.game.ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);

    // Отрисовка игрового поля
    for (let y = 0; y < this.game.BOARD_HEIGHT; y++) {
      for (let x = 0; x < this.game.BOARD_WIDTH; x++) {
        if (this.game.board[y][x] !== 0) {
          this.game.ctx.drawImage(
            this.preRenderedBlocks[this.game.board[y][x]],
            x * this.game.BLOCK_SIZE,
            y * this.game.BLOCK_SIZE
          );
        }
      }
    }

    this.renderGhostPiece();

    // Отрисовка текущей фигуры
    if (this.game.currentPiece) {
      const shape = this.game.currentPiece.shape;
      for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
          if (shape[y][x] !== 0) {
            this.game.ctx.drawImage(
              this.preRenderedBlocks[this.game.currentPiece.color],
              (this.game.currentPiece.x + x) * this.game.BLOCK_SIZE,
              (this.game.currentPiece.y + y) * this.game.BLOCK_SIZE
            );
          }
        }
      }
    }
  }

  renderGhostPiece() {
    if (!this.game.currentPiece) return;

    const ghostY = this.getGhostPieceY();
    const shape = this.game.currentPiece.shape;

    this.game.ctx.globalAlpha = 0.3;
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] !== 0) {
          this.game.ctx.drawImage(
            this.preRenderedBlocks[this.game.currentPiece.color],
            (this.game.currentPiece.x + x) * this.game.BLOCK_SIZE,
            (ghostY + y) * this.game.BLOCK_SIZE
          );
        }
      }
    }
    this.game.ctx.globalAlpha = 1.0;
  }

  getGhostPieceY() {
    let ghostY = this.game.currentPiece.y;
    while (this.game.isValidMove(this.game.currentPiece.x, ghostY + 1)) {
      ghostY++;
    }
    return ghostY;
  }

  renderGameOver() {
    this.game.ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    this.game.ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);

    this.game.ctx.fillStyle = '#FFF';
    this.game.ctx.font = 'bold 28px Arial';
    this.game.ctx.textAlign = 'center';
    this.game.ctx.fillText('ИГРА ОКОНЧЕНА', this.game.canvas.width / 2, this.game.canvas.height / 2 - 30);

    this.game.ctx.font = '20px Arial';
    this.game.ctx.fillText(`Счет: ${this.game.score}`, this.game.canvas.width / 2, this.game.canvas.height / 2 + 10);
    this.game.ctx.fillText(`Уровень: ${this.game.level}`, this.game.canvas.width / 2, this.game.canvas.height / 2 + 40);
  }
}