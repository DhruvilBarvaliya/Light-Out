import { INITIAL_UNLOCKED_LEVELS, TOTAL_LEVELS } from 'constants/game';
import { getDifficultyConfig, getLevelGridSize, type CasualDifficulty } from 'constants/gridConfig';

export type Grid = boolean[][];

export { INITIAL_UNLOCKED_LEVELS, TOTAL_LEVELS };

export function createEmptyGrid(size: number): Grid {
  return Array.from({ length: size }, () => Array.from({ length: size }, () => false));
}

export function flatToGrid(flat: boolean[], size: number): Grid {
  const grid: Grid = [];

  for (let row = 0; row < size; row += 1) {
    grid.push(flat.slice(row * size, row * size + size));
  }

  return grid;
}

export function gridToFlat(grid: Grid): boolean[] {
  return grid.flat();
}

export function toggleCell(grid: Grid, row: number, col: number): Grid {
  const size = grid.length;
  const next = grid.map((gridRow) => [...gridRow]);
  const offsets = [
    [0, 0],
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  for (const [rowOffset, colOffset] of offsets) {
    const targetRow = row + rowOffset;
    const targetCol = col + colOffset;

    if (targetRow >= 0 && targetRow < size && targetCol >= 0 && targetCol < size) {
      next[targetRow][targetCol] = !next[targetRow][targetCol];
    }
  }

  return next;
}

export function turnOffSingleLight(grid: Grid, row: number, col: number): Grid | null {
  if (!grid[row]?.[col]) {
    return null;
  }

  const next = grid.map((gridRow) => [...gridRow]);
  next[row][col] = false;
  return next;
}

export function isSolved(grid: Grid): boolean {
  return grid.every((row) => row.every((cell) => !cell));
}

export function hasLightsOn(grid: Grid): boolean {
  return grid.some((row) => row.some((cell) => cell));
}

function seededRandom(seed: number): number {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

function applyRandomTaps(size: number, tapCount: number, seed: number): Grid {
  let grid = createEmptyGrid(size);

  for (let index = 0; index < tapCount; index += 1) {
    const randomValue = seededRandom(seed + index * 17.31);
    const cellIndex = Math.floor(randomValue * size * size);
    const row = Math.floor(cellIndex / size);
    const col = cellIndex % size;
    grid = toggleCell(grid, row, col);
  }

  if (!hasLightsOn(grid)) {
    const fallbackIndex = Math.floor(seededRandom(seed + 99) * size * size);
    const row = Math.floor(fallbackIndex / size);
    const col = fallbackIndex % size;
    grid = toggleCell(grid, row, col);
  }

  return grid;
}

export function generateRandomPuzzle(difficulty: CasualDifficulty = 'medium'): Grid {
  const config = getDifficultyConfig(difficulty);
  const tapRange = config.maxTaps - config.minTaps + 1;
  const tapCount = Math.floor(Math.random() * tapRange) + config.minTaps;
  const seed = Math.floor(Math.random() * 100000);

  return applyRandomTaps(config.gridSize, tapCount, seed);
}

export function generateLevelPuzzle(level: number): Grid {
  const size = getLevelGridSize(level);
  const tapCount = 3 + Math.floor(size * 1.2) + (level % 5);

  return applyRandomTaps(size, tapCount, level * 97);
}

export function areStarterLevelsComplete(completedLevels: number[]): boolean {
  for (let level = 1; level <= INITIAL_UNLOCKED_LEVELS; level += 1) {
    if (!completedLevels.includes(level)) {
      return false;
    }
  }

  return true;
}

export function isLevelUnlocked(level: number, completedLevels: number[]): boolean {
  if (level <= INITIAL_UNLOCKED_LEVELS) {
    return true;
  }

  return areStarterLevelsComplete(completedLevels);
}
