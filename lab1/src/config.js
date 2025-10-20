export const THEME_STORAGE_KEY = 'tetris.theme';

export const GAME_SETTINGS = Object.freeze({
  blockSize: 30,
  boardWidth: 10,
  boardHeight: 20,
  baseDropSpeed: 1000,
  minDropSpeed: 50,
  dropAcceleration: 100,
  linePoints: [0, 40, 100, 300, 1200]
});

const CLASSIC_TETROMINO_COLORS = Object.freeze([
  '#000000', // empty
  '#00FFFF',
  '#FFFF00',
  '#800080',
  '#0000FF',
  '#FFA500',
  '#00FF00',
  '#FF0000'
]);

const MONOCHROME_TETROMINO_COLORS = Object.freeze([
  '#000000',
  '#f5f5f5',
  '#d9d9d9',
  '#bfbfbf',
  '#a6a6a6',
  '#8c8c8c',
  '#737373',
  '#595959'
]);

const PIXEL_TETROMINO_COLORS = Object.freeze([
  '#000000',
  '#ff595e',
  '#ffca3a',
  '#8ac926',
  '#1982c4',
  '#6a4c93',
  '#ff924c',
  '#ec368d'
]);

const RAINBOW_TETROMINO_COLORS = Object.freeze([
  '#000000',
  '#ff1744',
  '#ff9100',
  '#ffee58',
  '#00e676',
  '#2979ff',
  '#d500f9',
  '#00e5ff'
]);

const REALISTIC_TETROMINO_COLORS = Object.freeze([
  '#000000',
  '#9be7ff',
  '#ffd166',
  '#a5bfff',
  '#6ab8ff',
  '#ffb677',
  '#98f5e1',
  '#ff8fab'
]);

export const PIECE_SET = Object.freeze([
  { matrix: [[1, 1, 1, 1]], colorIndex: 1 },
  { matrix: [[2, 2], [2, 2]], colorIndex: 2 },
  { matrix: [[0, 3, 0], [3, 3, 3]], colorIndex: 3 },
  { matrix: [[4, 0, 0], [4, 4, 4]], colorIndex: 4 },
  { matrix: [[0, 0, 5], [5, 5, 5]], colorIndex: 5 },
  { matrix: [[0, 6, 6], [6, 6, 0]], colorIndex: 6 },
  { matrix: [[7, 7, 0], [0, 7, 7]], colorIndex: 7 }
]);

export const THEMES = Object.freeze({
  classic: {
    label: 'Classic Dark',
    variables: {
      'font-sans': "'Inter', 'Segoe UI', sans-serif",
      'font-mono': "'JetBrains Mono', 'Fira Code', monospace",
      'color-background': '#181818',
      'color-surface': '#212121',
      'color-surface-alt': '#2b2b2b',
      'color-border': 'rgba(255, 255, 255, 0.08)',
      'color-text': '#f5f5f5',
      'color-text-muted': 'rgba(255, 255, 255, 0.65)',
      'color-accent': '#4caf50',
      'color-accent-hover': '#43a047',
      'color-accent-contrast': '#ffffff',
      'color-secondary': '#ff9800',
      'color-secondary-hover': '#fb8c00',
      'color-warning': '#ffeb3b',
      'shadow-soft': '0 12px 28px rgba(0, 0, 0, 0.35)',
      'shadow-strong': '0 24px 60px rgba(0, 0, 0, 0.45)',
      'leaderboard-overlay': 'rgba(0, 0, 0, 0.75)',
      'board-background': '#000000',
      'board-border': '#333333',
      'board-border-width': '2px',
      'board-radius': '16px',
      'board-image-rendering': 'auto',
      'radius-panel': '16px',
      'radius-button': '12px',
      'radius-floating': '999px'
    },
    tetrominoColors: CLASSIC_TETROMINO_COLORS
  },
  neon: {
    label: 'Neon Night',
    variables: {
      'font-sans': "'Orbitron', 'Inter', sans-serif",
      'font-mono': "'Share Tech Mono', 'JetBrains Mono', monospace",
      'color-background': '#06050a',
      'color-surface': '#111026',
      'color-surface-alt': '#19163d',
      'color-border': 'rgba(255, 255, 255, 0.12)',
      'color-text': '#e5ebff',
      'color-text-muted': 'rgba(229, 235, 255, 0.65)',
      'color-accent': '#00d4ff',
      'color-accent-hover': '#00b6e6',
      'color-accent-contrast': '#07131d',
      'color-secondary': '#ff2fb9',
      'color-secondary-hover': '#ff5bc5',
      'color-warning': '#ffe066',
      'shadow-soft': '0 14px 40px rgba(7, 56, 144, 0.55)',
      'shadow-strong': '0 32px 70px rgba(138, 36, 255, 0.55)',
      'leaderboard-overlay': 'rgba(2, 6, 25, 0.85)',
      'board-background': '#050416',
      'board-border': '#301777',
      'board-border-width': '2px',
      'board-radius': '14px',
      'board-image-rendering': 'auto',
      'radius-panel': '18px',
      'radius-button': '12px',
      'radius-floating': '999px'
    },
    tetrominoColors: Object.freeze([
      '#000000',
      '#00d4ff',
      '#ffe066',
      '#9c27ff',
      '#2979ff',
      '#ff6f00',
      '#00ff9d',
      '#ff2fb9'
    ])
  },
  daylight: {
    label: 'Daylight',
    variables: {
      'font-sans': "'Inter', 'Segoe UI', sans-serif",
      'font-mono': "'JetBrains Mono', 'Fira Code', monospace",
      'color-background': '#f3f6fb',
      'color-surface': '#ffffff',
      'color-surface-alt': '#f1f4f9',
      'color-border': 'rgba(14, 23, 38, 0.08)',
      'color-text': '#1e293b',
      'color-text-muted': 'rgba(30, 41, 59, 0.65)',
      'color-accent': '#2563eb',
      'color-accent-hover': '#1d4ed8',
      'color-accent-contrast': '#ffffff',
      'color-secondary': '#f97316',
      'color-secondary-hover': '#ea580c',
      'color-warning': '#f59e0b',
      'shadow-soft': '0 12px 24px rgba(15, 23, 42, 0.12)',
      'shadow-strong': '0 24px 50px rgba(15, 23, 42, 0.18)',
      'leaderboard-overlay': 'rgba(15, 23, 42, 0.35)',
      'board-background': '#e2e8f0',
      'board-border': 'rgba(15, 23, 42, 0.18)',
      'board-border-width': '2px',
      'board-radius': '20px',
      'board-image-rendering': 'auto',
      'radius-panel': '20px',
      'radius-button': '12px',
      'radius-floating': '999px'
    },
    tetrominoColors: Object.freeze([
      '#000000',
      '#0284c7',
      '#f59e0b',
      '#7c3aed',
      '#1d4ed8',
      '#f97316',
      '#22c55e',
      '#ef4444'
    ])
  },
  monochrome: {
    label: 'Retro Mono',
    variables: {
      'font-sans': "'IBM Plex Sans', 'Helvetica Neue', sans-serif",
      'font-mono': "'IBM Plex Mono', 'Courier New', monospace",
      'color-background': '#0d0d0d',
      'color-surface': '#111111',
      'color-surface-alt': '#151515',
      'color-border': 'rgba(255, 255, 255, 0.12)',
      'color-text': '#f5f5f5',
      'color-text-muted': 'rgba(245, 245, 245, 0.55)',
      'color-accent': '#d9d9d9',
      'color-accent-hover': '#ffffff',
      'color-accent-contrast': '#0b0b0b',
      'color-secondary': '#9e9e9e',
      'color-secondary-hover': '#dcdcdc',
      'color-warning': '#ffffff',
      'shadow-soft': '0 10px 26px rgba(0, 0, 0, 0.5)',
      'shadow-strong': '0 30px 60px rgba(0, 0, 0, 0.65)',
      'leaderboard-overlay': 'rgba(0, 0, 0, 0.82)',
      'board-background': '#050505',
      'board-border': '#2a2a2a',
      'board-border-width': '2px',
      'board-radius': '12px',
      'board-image-rendering': 'auto',
      'radius-panel': '14px',
      'radius-button': '10px',
      'radius-floating': '24px'
    },
    tetrominoColors: MONOCHROME_TETROMINO_COLORS
  },
  pixel: {
    label: 'Pixel Arcade',
    variables: {
      'font-sans': "'Press Start 2P', 'Courier New', monospace",
      'font-mono': "'Press Start 2P', 'Courier New', monospace",
      'color-background': '#18122b',
      'color-surface': '#241a3d',
      'color-surface-alt': '#1c1531',
      'color-border': 'rgba(255, 255, 255, 0.25)',
      'color-text': '#f8f7ff',
      'color-text-muted': 'rgba(248, 247, 255, 0.7)',
      'color-accent': '#ffcc00',
      'color-accent-hover': '#ffb300',
      'color-accent-contrast': '#281c46',
      'color-secondary': '#00e5ff',
      'color-secondary-hover': '#00c4e6',
      'color-warning': '#ff6ec7',
      'shadow-soft': '0 18px 40px rgba(0, 0, 0, 0.45)',
      'shadow-strong': '0 28px 70px rgba(0, 0, 0, 0.55)',
      'leaderboard-overlay': 'rgba(10, 8, 26, 0.85)',
      'board-background': '#100b25',
      'board-border': '#ffcc00',
      'board-border-width': '4px',
      'board-radius': '8px',
      'board-image-rendering': 'pixelated',
      'radius-panel': '10px',
      'radius-button': '8px',
      'radius-floating': '18px'
    },
    tetrominoColors: PIXEL_TETROMINO_COLORS
  },
  rainbow: {
    label: 'Rainbow Pop',
    variables: {
      'font-sans': "'Nunito', 'Inter', sans-serif",
      'font-mono': "'Share Tech Mono', 'JetBrains Mono', monospace",
      'color-background': 'linear-gradient(135deg, #120458 0%, #42009c 35%, #ff009d 70%, #f8b500 100%)',
      'color-surface': 'rgba(18, 17, 32, 0.85)',
      'color-surface-alt': 'rgba(35, 16, 58, 0.65)',
      'color-border': 'rgba(255, 255, 255, 0.22)',
      'color-text': '#fdfdff',
      'color-text-muted': 'rgba(253, 253, 255, 0.7)',
      'color-accent': '#ff9f1c',
      'color-accent-hover': '#ff7e00',
      'color-accent-contrast': '#1a052d',
      'color-secondary': '#2ec4b6',
      'color-secondary-hover': '#1fab9f',
      'color-warning': '#e0ff4f',
      'shadow-soft': '0 20px 48px rgba(44, 9, 80, 0.55)',
      'shadow-strong': '0 36px 80px rgba(73, 2, 156, 0.65)',
      'leaderboard-overlay': 'rgba(12, 4, 28, 0.78)',
      'board-background': '#170531',
      'board-border': '#ff006e',
      'board-border-width': '3px',
      'board-radius': '18px',
      'board-image-rendering': 'auto',
      'radius-panel': '18px',
      'radius-button': '14px',
      'radius-floating': '999px'
    },
    tetrominoColors: RAINBOW_TETROMINO_COLORS
  },
  glass: {
    label: 'Glass Neo',
    variables: {
      'font-sans': "'Poppins', 'Inter', sans-serif",
      'font-mono': "'Roboto Mono', 'JetBrains Mono', monospace",
      'color-background': 'linear-gradient(160deg, #060b16 0%, #10233d 50%, #0f3b4f 100%)',
      'color-surface': 'rgba(16, 35, 58, 0.72)',
      'color-surface-alt': 'rgba(15, 44, 66, 0.58)',
      'color-border': 'rgba(255, 255, 255, 0.15)',
      'color-text': '#e9f1ff',
      'color-text-muted': 'rgba(233, 241, 255, 0.72)',
      'color-accent': '#9be7ff',
      'color-accent-hover': '#80d8ff',
      'color-accent-contrast': '#041625',
      'color-secondary': '#ffd166',
      'color-secondary-hover': '#ffb703',
      'color-warning': '#ffe299',
      'shadow-soft': '0 32px 64px rgba(9, 25, 45, 0.45)',
      'shadow-strong': '0 48px 100px rgba(9, 25, 45, 0.55)',
      'leaderboard-overlay': 'rgba(7, 17, 31, 0.82)',
      'board-background': 'rgba(9, 24, 39, 0.95)',
      'board-border': 'rgba(155, 231, 255, 0.45)',
      'board-border-width': '2px',
      'board-radius': '22px',
      'board-image-rendering': 'auto',
      'radius-panel': '22px',
      'radius-button': '14px',
      'radius-floating': '999px'
    },
    tetrominoColors: REALISTIC_TETROMINO_COLORS
  }
});

export const DEFAULT_THEME = 'classic';
