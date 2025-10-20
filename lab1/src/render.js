export class Renderer {
  constructor(game) {
    this.game = game;
    this.preRenderedBlocks = this.preRenderBlocks();
    this.previewCanvas = document.getElementById('next-piece-canvas');
    this.previewCtx = this.previewCanvas ? this.previewCanvas.getContext('2d') : null;
  }

  preRenderBlocks() {
    const blocks = {};
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = this.game.BLOCK_SIZE;
    tempCanvas.height = this.game.BLOCK_SIZE;
    const tempCtx = tempCanvas.getContext('2d');

    this.game.colors.forEach((color, index) => {
      if (index === 0) return;

      tempCtx.clearRect(0, 0, this.game.BLOCK_SIZE, this.game.BLOCK_SIZE);

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

  rebuildBlocks() {
    this.preRenderedBlocks = this.preRenderBlocks();
    this.renderNextPiece(this.game.nextPieceTemplate);
  }

  renderNextPiece(template) {
    if (!this.previewCtx || !this.previewCanvas) return;

    const ctx = this.previewCtx;
    const canvas = this.previewCanvas;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!template || !template.matrix?.length) {
      return;
    }

    const rows = template.matrix.length;
    const cols = Math.max(...template.matrix.map((row) => row.length));
    if (rows === 0 || cols === 0) return;

    const padding = Math.floor(canvas.width * 0.1);
    const availableWidth = canvas.width - padding * 2;
    const availableHeight = canvas.height - padding * 2;
    let blockSize = Math.floor(Math.min(availableWidth / cols, availableHeight / rows));
    if (blockSize <= 0) {
      blockSize = Math.floor(canvas.width / Math.max(rows, cols));
    }

    const usedWidth = cols * blockSize;
    const usedHeight = rows * blockSize;
    const offsetX = Math.floor((canvas.width - usedWidth) / 2);
    const offsetY = Math.floor((canvas.height - usedHeight) / 2);

    const colorIndex = template.colorIndex ?? 0;
  const blockImage = this.preRenderedBlocks[colorIndex];
    const fallbackColor = this.game.colors?.[colorIndex] ?? '#ffffff';

    ctx.save();
    ctx.imageSmoothingEnabled = false;

    for (let y = 0; y < rows; y++) {
      const row = template.matrix[y];
      for (let x = 0; x < row.length; x++) {
        if (row[x] === 0) continue;
        const drawX = offsetX + x * blockSize;
        const drawY = offsetY + y * blockSize;

        if (blockImage && blockImage.complete) {
          ctx.drawImage(blockImage, drawX, drawY, blockSize, blockSize);
        } else {
          ctx.fillStyle = fallbackColor;
          ctx.fillRect(drawX, drawY, blockSize, blockSize);

          if (blockImage && !blockImage.complete) {
            blockImage.addEventListener('load', () => {
              this.renderNextPiece(template);
            }, { once: true });
          }
        }
      }
    }

    ctx.restore();
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
    const rootStyles = getComputedStyle(document.documentElement);
    const overlayColor = rootStyles.getPropertyValue('--leaderboard-overlay').trim() || 'rgba(0, 0, 0, 0.85)';
    const textColor = rootStyles.getPropertyValue('--color-text').trim() || '#ffffff';
    const accentColor = rootStyles.getPropertyValue('--color-accent').trim() || '#4caf50';
    const fontSans = rootStyles.getPropertyValue('--font-sans').replaceAll('"', '').trim() || 'Inter, sans-serif';

    this.game.ctx.fillStyle = overlayColor;
    this.game.ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);

    this.game.ctx.textAlign = 'center';
    this.game.ctx.fillStyle = textColor;
    this.game.ctx.font = `bold 28px ${fontSans}`;
    this.game.ctx.fillText('ИГРА ОКОНЧЕНА', this.game.canvas.width / 2, this.game.canvas.height / 2 - 30);

    this.game.ctx.font = `600 20px ${fontSans}`;
    this.game.ctx.fillStyle = accentColor;
    this.game.ctx.fillText(`Счет: ${this.game.score}`, this.game.canvas.width / 2, this.game.canvas.height / 2 + 10);
    this.game.ctx.fillText(`Уровень: ${this.game.level}`, this.game.canvas.width / 2, this.game.canvas.height / 2 + 40);
  }
}