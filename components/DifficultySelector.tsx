import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { CASUAL_DIFFICULTIES, CasualDifficulty } from 'constants/gridConfig';

interface DifficultySelectorProps {
  selected: CasualDifficulty;
  onSelect: (difficulty: CasualDifficulty) => void;
  disabled?: boolean;
}

export function DifficultySelector({
  selected,
  onSelect,
  disabled = false,
}: DifficultySelectorProps) {
  return (
    <View className="w-full">
      <Text className="mb-2 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
        Difficulty
      </Text>
      <View className="flex-row gap-2">
        {CASUAL_DIFFICULTIES.map((difficulty) => {
          const isSelected = selected === difficulty.id;

          return (
            <Pressable
              key={difficulty.id}
              onPress={() => onSelect(difficulty.id)}
              disabled={disabled}
              className={`flex-1 items-center rounded-xl border px-2 py-3 ${
                isSelected
                  ? 'border-cyan-400/40 bg-cyan-400/10'
                  : 'border-slate-700 bg-[#1a1040]'
              } ${disabled ? 'opacity-60' : ''}`}
              accessibilityRole="button"
              accessibilityLabel={`${difficulty.label} difficulty`}
              accessibilityState={{ selected: isSelected, disabled }}>
              <Text
                className={`text-sm font-bold ${isSelected ? 'text-cyan-300' : 'text-white'}`}>
                {difficulty.label}
              </Text>
              <Text className={`mt-1 text-[10px] ${isSelected ? 'text-slate-400' : 'text-slate-500'}`}>
                {difficulty.description}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
