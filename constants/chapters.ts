import { TOTAL_LEVELS } from 'utils/lightsOut';

export const LEVELS_PER_PAGE = 10;

export const CHAPTERS = [
  { name: 'First Spark', subtitle: 'Learn the glow' },
  { name: 'Warm Up', subtitle: 'Build your rhythm' },
  { name: 'Bright Mind', subtitle: 'Think ahead' },
  { name: 'Night Shift', subtitle: 'Sharpen tactics' },
  { name: 'Dark Arts', subtitle: 'Master patterns' },
  { name: 'Blackout', subtitle: 'Final challenge' },
] as const;

export const TOTAL_PAGES = Math.ceil(TOTAL_LEVELS / LEVELS_PER_PAGE);

export function getPageLevels(pageIndex: number): number[] {
  const start = pageIndex * LEVELS_PER_PAGE + 1;
  const end = Math.min(start + LEVELS_PER_PAGE - 1, TOTAL_LEVELS);

  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

export function getChapterProgress(
  pageIndex: number,
  completedLevels: number[]
): { completed: number; total: number } {
  const levels = getPageLevels(pageIndex);

  return {
    completed: levels.filter((level) => completedLevels.includes(level)).length,
    total: levels.length,
  };
}

export function findNextPlayableLevel(
  completedLevels: number[],
  isUnlocked: (level: number) => boolean
): number | null {
  for (let level = 1; level <= TOTAL_LEVELS; level += 1) {
    if (isUnlocked(level) && !completedLevels.includes(level)) {
      return level;
    }
  }

  return null;
}
