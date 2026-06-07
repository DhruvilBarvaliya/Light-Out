import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

import { formatBestScore } from 'utils/formatScore';

interface MoveStatsProps {
  moves: number;
  bestMoves: number | null;
  isNewRecord?: boolean;
  compact?: boolean;
}

export function MoveStats({ moves, bestMoves, isNewRecord = false, compact = false }: MoveStatsProps) {
  if (compact) {
    return (
      <View className="rounded-2xl border border-cyan-400/15 bg-[#1a1040] px-4 py-3">
        <View className="flex-row items-center gap-4">
          <View>
            <Text className="text-[10px] uppercase tracking-wider text-slate-500">Moves</Text>
            <Text className="text-lg font-bold text-white">{moves}</Text>
          </View>
          <View className="h-8 w-px bg-cyan-400/20" />
          <View>
            <View className="flex-row items-center gap-1">
              <Ionicons name="trophy-outline" size={10} color="#fbbf24" />
              <Text className="text-[10px] uppercase tracking-wider text-slate-500">Best</Text>
            </View>
            <Text className="text-lg font-bold text-amber-300">{formatBestScore(bestMoves)}</Text>
          </View>
        </View>
        {isNewRecord ? (
          <Text className="mt-1 text-[10px] font-semibold text-green-400">New best!</Text>
        ) : null}
      </View>
    );
  }

  return (
    <View className="items-center">
      <View className="flex-row items-center gap-6">
        <View className="items-center">
          <Text className="text-xs uppercase tracking-wider text-slate-500">Moves</Text>
          <Text className="mt-1 text-2xl font-bold text-white">{moves}</Text>
        </View>

        <View className="h-10 w-px bg-cyan-400/20" />

        <View className="items-center">
          <View className="flex-row items-center gap-1">
            <Ionicons name="trophy-outline" size={12} color="#fbbf24" />
            <Text className="text-xs uppercase tracking-wider text-slate-500">Best</Text>
          </View>
          <Text className="mt-1 text-2xl font-bold text-amber-300">
            {formatBestScore(bestMoves)}
          </Text>
        </View>
      </View>

      {isNewRecord ? (
        <Text className="mt-2 text-xs font-semibold text-green-400">New best record!</Text>
      ) : null}
    </View>
  );
}
