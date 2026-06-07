import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { flatToGrid, Grid, isSolved, toggleCell } from 'utils/lightsOut';

const GRID_SIZE = 3;
const TOTAL_MOVES = 4;

const DEMO_MOVES = [
  {
    cell: 4,
    prompt: 'Tap the center. It flips this cell and all four neighbors.',
  },
  {
    cell: 1,
    prompt: 'Tap the top-middle light. Watch how the top row changes.',
  },
  {
    cell: 3,
    prompt: 'Tap the middle-left light. Neighbors flip again.',
  },
  {
    cell: 7,
    prompt: 'Tap the bottom-middle light to turn off the last lights.',
  },
] as const;

const DEMO_START = flatToGrid(
  [false, false, true, false, false, true, false, false, true],
  GRID_SIZE
);

type DemoPhase = 'idle' | 'goal' | 'playing' | 'complete';

function indexToPosition(index: number) {
  return {
    row: Math.floor(index / GRID_SIZE),
    col: index % GRID_SIZE,
  };
}

interface DemoCellProps {
  isOn: boolean;
  highlighted: boolean;
  disabled: boolean;
  onPress: () => void;
}

function DemoCell({ isOn, highlighted, disabled, onPress }: DemoCellProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`h-12 w-12 items-center justify-center rounded-lg ${
        highlighted ? 'border-2 border-cyan-400 bg-cyan-400/10' : ''
      } ${isOn ? 'bg-amber-400' : 'bg-[#2a1f5c]'} ${disabled && !highlighted ? 'opacity-60' : ''}`}
      accessibilityRole="button"
      accessibilityLabel={isOn ? 'Light on' : 'Light off'}
      accessibilityState={{ disabled }}>
      {highlighted ? <View className="h-2 w-2 rounded-full bg-cyan-300" /> : null}
    </Pressable>
  );
}

function MoveProgress({ currentMove }: { currentMove: number }) {
  return (
    <View className="mb-3 flex-row items-center justify-center gap-2">
      {DEMO_MOVES.map((_, index) => (
        <View
          key={index}
          className={`h-2 w-2 rounded-full ${
            index < currentMove ? 'bg-green-400' : index === currentMove ? 'bg-cyan-400' : 'bg-slate-600'
          }`}
        />
      ))}
    </View>
  );
}

export function DemoTutorial() {
  const [phase, setPhase] = useState<DemoPhase>('idle');
  const [moveIndex, setMoveIndex] = useState(0);
  const [grid, setGrid] = useState<Grid>(DEMO_START);

  const flatGrid = useMemo(() => grid.flat(), [grid]);
  const currentMove = DEMO_MOVES[moveIndex];
  const highlightedIndex = phase === 'playing' ? currentMove.cell : null;
  const isInteractive = phase === 'playing';

  function startDemo() {
    setGrid(DEMO_START);
    setMoveIndex(0);
    setPhase('goal');
  }

  function resetDemo() {
    setGrid(DEMO_START);
    setMoveIndex(0);
    setPhase('idle');
  }

  function handleCellPress(index: number) {
    if (!isInteractive || index !== currentMove.cell) {
      return;
    }

    const { row, col } = indexToPosition(index);
    const nextGrid = toggleCell(grid, row, col);
    setGrid(nextGrid);

    const nextMoveIndex = moveIndex + 1;

    if (nextMoveIndex >= TOTAL_MOVES && isSolved(nextGrid)) {
      setPhase('complete');
      return;
    }

    setMoveIndex(nextMoveIndex);
  }

  if (phase === 'idle') {
    return (
      <View className="my-4 rounded-xl border border-amber-400/20 bg-[#12122b] p-4">
        <View className="flex-row items-center gap-2">
          <Ionicons name="school-outline" size={18} color="#fbbf24" />
          <Text className="text-sm font-semibold text-amber-300">First time playing?</Text>
        </View>
        <Text className="mt-2 text-sm leading-5 text-slate-400">
          Learn the rules by playing a short guided demo.
        </Text>
        <Pressable
          onPress={startDemo}
          className="mt-4 items-center rounded-xl border border-cyan-400/40 bg-cyan-400/10 py-3"
          accessibilityRole="button"
          accessibilityLabel="Start demo tutorial">
          <Text className="text-sm font-semibold text-cyan-300">Start Demo</Text>
        </Pressable>
      </View>
    );
  }

  const guideMessage =
    phase === 'goal'
      ? 'Yellow lights are ON. Your goal is to turn off every light on the board.'
      : phase === 'playing'
        ? currentMove.prompt
        : 'Great job! You cleared the board. You are ready for the real game.';

  return (
    <View className="my-4 rounded-xl border border-cyan-400/20 bg-[#12122b] p-4">
      <View className="mb-3 flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Ionicons name="game-controller-outline" size={18} color="#22d3ee" />
          <Text className="text-sm font-semibold text-cyan-300">Interactive Demo</Text>
        </View>
        {phase === 'complete' ? (
          <Pressable onPress={resetDemo} accessibilityRole="button" accessibilityLabel="Restart demo">
            <Text className="text-xs text-slate-400">Restart</Text>
          </Pressable>
        ) : null}
      </View>

      {phase === 'playing' ? <MoveProgress currentMove={moveIndex} /> : null}

      <View className="mb-4 rounded-lg bg-cyan-400/10 px-3 py-2">
        <Text className="text-sm leading-5 text-cyan-100">{guideMessage}</Text>
      </View>

      <View className="items-center">
        <View className="flex-row flex-wrap justify-center gap-2" style={{ width: GRID_SIZE * 56 }}>
          {flatGrid.map((isOn, index) => (
            <DemoCell
              key={index}
              isOn={isOn}
              highlighted={highlightedIndex === index}
              disabled={!isInteractive || highlightedIndex !== index}
              onPress={() => handleCellPress(index)}
            />
          ))}
        </View>
      </View>

      {phase === 'goal' ? (
        <Pressable
          onPress={() => setPhase('playing')}
          className="mt-4 items-center rounded-xl border border-cyan-400/30 py-2.5"
          accessibilityRole="button"
          accessibilityLabel="Continue demo">
          <Text className="text-sm font-medium text-white">Got it, let me try</Text>
        </Pressable>
      ) : null}

      {phase === 'complete' ? (
        <View className="mt-4 flex-row items-center justify-center gap-2">
          <Ionicons name="checkmark-circle" size={18} color="#4ade80" />
          <Text className="text-sm font-medium text-green-400">Demo complete</Text>
        </View>
      ) : null}
    </View>
  );
}
