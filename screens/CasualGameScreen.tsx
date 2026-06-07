import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DifficultySelector } from 'components/DifficultySelector';
import { GameBoard } from 'components/GameBoard';
import { LifelineButton } from 'components/LifelineButton';
import { MoveStats } from 'components/MoveStats';
import { ScreenHeader } from 'components/ScreenHeader';
import { WinModal } from 'components/WinModal';
import {
  CasualDifficulty,
  getBoardPixelSize,
  getCellSizeForGrid,
  getDifficultyConfig,
} from 'constants/gridConfig';
import { useScores } from 'context/ScoresContext';
import { useGamePlay } from 'hooks/useGamePlay';
import { generateRandomPuzzle } from 'utils/lightsOut';

interface CasualGameScreenProps {
  onBack: () => void;
}

export function CasualGameScreen({ onBack }: CasualGameScreenProps) {
  const insets = useSafeAreaInsets();
  const { getCasualBest, recordCasualScore } = useScores();
  const [difficulty, setDifficulty] = useState<CasualDifficulty>('medium');
  const difficultyConfig = getDifficultyConfig(difficulty);
  const gridSize = difficultyConfig.gridSize;

  const cellSize = useMemo(() => getCellSizeForGrid(gridSize), [gridSize]);
  const boardSize = useMemo(() => getBoardPixelSize(gridSize, cellSize), [gridSize, cellSize]);
  const bestMoves = getCasualBest(difficulty);

  const [showWinModal, setShowWinModal] = useState(false);
  const [isNewRecord, setIsNewRecord] = useState(false);

  const handleSolved = useCallback(
    (moveCount: number) => {
      setIsNewRecord(recordCasualScore(difficulty, moveCount));
      setShowWinModal(true);
    },
    [difficulty, recordCasualScore]
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
    initialGrid: generateRandomPuzzle(difficulty),
    onSolved: handleSolved,
  });

  const startNewPuzzle = useCallback(
    (nextDifficulty: CasualDifficulty = difficulty) => {
      resetGame(generateRandomPuzzle(nextDifficulty));
      setShowWinModal(false);
      setIsNewRecord(false);
    },
    [difficulty, resetGame]
  );

  function handleDifficultyChange(nextDifficulty: CasualDifficulty) {
    setDifficulty(nextDifficulty);
    startNewPuzzle(nextDifficulty);
  }

  return (
    <View className="flex-1 bg-[#12122b]">
      <ScreenHeader title="Casual Play" onBack={onBack} />

      <View className="flex-1 justify-center px-6">
        <View className="mb-4">
          <DifficultySelector
            selected={difficulty}
            onSelect={handleDifficultyChange}
            disabled={won}
          />
        </View>

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
              : `${difficultyConfig.label} · ${difficultyConfig.description} · random puzzle`}
          </Text>
        </View>

        <View
          className="items-center justify-center self-center overflow-hidden rounded-3xl border border-cyan-400/15 bg-[#1a1040] p-4"
          style={{ width: boardSize + 32, minHeight: boardSize + 56 }}>
          <Text className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
            {difficultyConfig.description}
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
          <Pressable
            onPress={() => startNewPuzzle()}
            className="items-center rounded-2xl border border-cyan-400/30 bg-[#1a1040] py-4">
            <Text className="text-base font-semibold text-white">New Puzzle</Text>
          </Pressable>
        </View>
      </View>

      <WinModal
        visible={showWinModal}
        title="Lights Out!"
        subtitle={`You cleared the ${difficultyConfig.description} board.`}
        moves={moves}
        bestMoves={getCasualBest(difficulty)}
        isNewRecord={isNewRecord}
        primaryLabel="Awesome!"
        onPrimaryAction={() => setShowWinModal(false)}
      />
    </View>
  );
}
