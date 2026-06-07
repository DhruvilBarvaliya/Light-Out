import { useCallback, useState } from 'react';

import { Grid, isSolved, toggleCell, turnOffSingleLight } from 'utils/lightsOut';

interface UseGamePlayOptions {
  initialGrid: Grid;
  onSolved: (moves: number) => void;
}

export function useGamePlay({ initialGrid, onSolved }: UseGamePlayOptions) {
  const [grid, setGrid] = useState<Grid>(initialGrid);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);
  const [lifelineUsed, setLifelineUsed] = useState(false);
  const [lifelineMode, setLifelineMode] = useState(false);

  const resetGame = useCallback((nextGrid: Grid) => {
    setGrid(nextGrid);
    setMoves(0);
    setWon(false);
    setLifelineUsed(false);
    setLifelineMode(false);
  }, []);

  const checkWin = useCallback(
    (nextGrid: Grid, moveCount: number) => {
      if (isSolved(nextGrid)) {
        setWon(true);
        setLifelineMode(false);
        onSolved(moveCount);
      }
    },
    [onSolved]
  );

  const handleCellPress = useCallback(
    (row: number, col: number) => {
      if (won) {
        return;
      }

      if (lifelineMode) {
        const nextGrid = turnOffSingleLight(grid, row, col);

        if (!nextGrid) {
          return;
        }

        setGrid(nextGrid);
        setLifelineUsed(true);
        setLifelineMode(false);
        checkWin(nextGrid, moves);
        return;
      }

      const nextGrid = toggleCell(grid, row, col);
      const nextMoves = moves + 1;
      setGrid(nextGrid);
      setMoves(nextMoves);
      checkWin(nextGrid, nextMoves);
    },
    [checkWin, grid, lifelineMode, moves, won]
  );

  const toggleLifelineMode = useCallback(() => {
    if (lifelineUsed || won) {
      return;
    }

    setLifelineMode((current) => !current);
  }, [lifelineUsed, won]);

  const cancelLifelineMode = useCallback(() => {
    setLifelineMode(false);
  }, []);

  return {
    grid,
    moves,
    won,
    lifelineUsed,
    lifelineMode,
    handleCellPress,
    toggleLifelineMode,
    cancelLifelineMode,
    resetGame,
  };
}
