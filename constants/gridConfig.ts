import { Dimensions } from 'react-native';

import { TOTAL_LEVELS } from './game';

export const LEVEL_MIN_GRID_SIZE = 4;
export const LEVEL_MAX_GRID_SIZE = 7;

export type CasualDifficulty = 'easy' | 'medium' | 'hard';

export const CASUAL_MAX_GRID_SIZE = 7;

export const CASUAL_DIFFICULTIES: {
  id: CasualDifficulty;
  label: string;
  gridSize: number;
  description: string;
  minTaps: number;
  maxTaps: number;
}[] = [
  {
    id: 'easy',
    label: 'Easy',
    gridSize: 3,
    description: '3×3 grid',
    minTaps: 3,
    maxTaps: 5,
  },
  {
    id: 'medium',
    label: 'Medium',
    gridSize: 5,
    description: '5×5 grid',
    minTaps: 5,
    maxTaps: 9,
  },
  {
    id: 'hard',
    label: 'Hard',
    gridSize: 7,
    description: '7×7 grid',
    minTaps: 8,
    maxTaps: 14,
  },
];

const BOARD_HORIZONTAL_PADDING = 48;
export const CELL_GAP = 8;

export function getLevelGridSize(level: number): number {
  if (level <= 1) {
    return LEVEL_MIN_GRID_SIZE;
  }

  if (level >= TOTAL_LEVELS) {
    return LEVEL_MAX_GRID_SIZE;
  }

  const progress = (level - 1) / (TOTAL_LEVELS - 1);
  return Math.round(LEVEL_MIN_GRID_SIZE + progress * (LEVEL_MAX_GRID_SIZE - LEVEL_MIN_GRID_SIZE));
}

export function getCellSizeForGrid(gridSize: number): number {
  const screenWidth = Dimensions.get('window').width;
  const maxBoardWidth = screenWidth - BOARD_HORIZONTAL_PADDING;
  const calculatedSize = Math.floor(
    (maxBoardWidth - (gridSize - 1) * CELL_GAP) / gridSize
  );

  return Math.min(56, Math.max(34, calculatedSize));
}

export function getDifficultyConfig(difficulty: CasualDifficulty) {
  return CASUAL_DIFFICULTIES.find((item) => item.id === difficulty) ?? CASUAL_DIFFICULTIES[1];
}

export function getBoardDimensions(gridSize: number) {
  const cellSize = getCellSizeForGrid(gridSize);
  const boardSize = gridSize * cellSize + (gridSize - 1) * CELL_GAP;

  return { cellSize, boardSize };
}

export function getCasualCellSize(): number {
  return getCellSizeForGrid(CASUAL_MAX_GRID_SIZE);
}

export function getCasualBoardSlotSize() {
  const cellSize = getCasualCellSize();
  const boardSize = getBoardPixelSize(CASUAL_MAX_GRID_SIZE, cellSize);

  return boardSize + 32;
}

export function getBoardPixelSize(gridSize: number, cellSize: number): number {
  return gridSize * cellSize + (gridSize - 1) * CELL_GAP;
}
