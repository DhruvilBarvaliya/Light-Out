import React, { useCallback, useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GameBoard } from 'components/GameBoard';
import { LifelineButton } from 'components/LifelineButton';
import { MoveStats } from 'components/MoveStats';
import { ScreenHeader } from 'components/ScreenHeader';
import { WinModal } from 'components/WinModal';
import { getBoardPixelSize, getCellSizeForGrid, getLevelGridSize } from 'constants/gridConfig';
import { useProgress } from 'context/ProgressContext';
import { useScores } from 'context/ScoresContext';
import { useGamePlay } from 'hooks/useGamePlay';
import { generateLevelPuzzle } from 'utils/lightsOut';

interface LevelGameScreenProps {
  level: number;
  onBack: () => void;
}

export function LevelGameScreen({ level, onBack }: LevelGameScreenProps) {
  const insets = useSafeAreaInsets();
  const { completeLevel } = useProgress();
  const { getLevelBest, recordLevelScore } = useScores();
  const gridSize = getLevelGridSize(level);
  const cellSize = useMemo(() => getCellSizeForGrid(gridSize), [gridSize]);
  const boardSize = useMemo(() => getBoardPixelSize(gridSize, cellSize), [gridSize, cellSize]);
  const bestMoves = getLevelBest(level);

  const initialGrid = useMemo(() => generateLevelPuzzle(level), [level]);

  const [showWinModal, setShowWinModal] = useState(false);
  const [isNewRecord, setIsNewRecord] = useState(false);

  const handleSolved = useCallback(
    (moveCount: number) => {
      completeLevel(level);
      setIsNewRecord(recordLevelScore(level, moveCount));
      setShowWinModal(true);
    },
    [completeLevel, level, recordLevelScore]
  );

  const {
    grid,
    moves,
    won,
    lifelineUsed,
    lifelineMode,
    handleCellPress,
    toggleLifelineMode,
    resetGame,
  } = useGamePlay({
    initialGrid,
    onSolved: handleSolved,
  });

  function handleRetry() {
    resetGame(initialGrid);
    setShowWinModal(false);
    setIsNewRecord(false);
  }

  return (
    <View className="flex-1 bg-[#12122b]">
      <ScreenHeader title={`Level ${level}`} onBack={onBack} />

      <View className="flex-1 justify-center px-6">
        <View className="mb-4 flex-row items-stretch justify-between gap-3">
          <View className="flex-1">
            <MoveStats
              moves={moves}
              bestMoves={bestMoves}
              isNewRecord={isNewRecord && won}
              compact
            />
          </View>
          <LifelineButton
            available={!lifelineUsed && !won}
            active={lifelineMode}
            onPress={toggleLifelineMode}
          />
        </View>

        <View className="mb-3 min-h-[28px] justify-center">
          <Text className="text-center text-xs text-purple-300">
            {lifelineMode
              ? 'Tap a lit cell — turns off only that light'
              : `Level ${level} · ${gridSize}×${gridSize} grid`}
          </Text>
        </View>

        <View
          className="items-center justify-center self-center overflow-hidden rounded-3xl border border-cyan-400/15 bg-[#1a1040] p-4"
          style={{ width: boardSize + 32, minHeight: boardSize + 56 }}>
          <Text className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
            Level {level}
          </Text>
          <GameBoard
            grid={grid}
            onCellPress={handleCellPress}
            disabled={won}
            cellSize={cellSize}
            lifelineMode={lifelineMode}
          />
        </View>
      </View>

      <View
        className="border-t border-cyan-400/10 bg-[#12122b] px-6 pt-3"
        style={{ paddingBottom: Math.max(insets.bottom, 12) + 12 }}>
        <View className="w-full max-w-xs gap-3 self-center">
          {!won ? (
            <Pressable
              onPress={handleRetry}
              className="items-center rounded-2xl border border-cyan-400/30 bg-[#1a1040] py-4">
              <Text className="text-base font-semibold text-white">Retry</Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={onBack}
              className="items-center rounded-2xl border border-cyan-400/30 bg-[#1a1040] py-4">
              <Text className="text-base font-semibold text-white">Back to Levels</Text>
            </Pressable>
          )}
        </View>
      </View>

      <WinModal
        visible={showWinModal}
        title="Level Complete!"
        subtitle={`You conquered level ${level} on a ${gridSize}×${gridSize} board.`}
        moves={moves}
        bestMoves={getLevelBest(level)}
        isNewRecord={isNewRecord}
        primaryLabel="Continue"
        onPrimaryAction={() => setShowWinModal(false)}
      />
    </View>
  );
}
