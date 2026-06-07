import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { formatBestScore } from 'utils/formatScore';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface LevelCardProps {
  level: number;
  unlocked: boolean;
  completed: boolean;
  isNext: boolean;
  bestMoves: number | null;
  onPress: () => void;
}

export function LevelCard({
  level,
  unlocked,
  completed,
  isNext,
  bestMoves,
  onPress,
}: LevelCardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  function handlePressIn() {
    if (unlocked) {
      scale.value = withSpring(0.92, { damping: 15, stiffness: 300 });
    }
  }

  function handlePressOut() {
    scale.value = withSpring(1, { damping: 12, stiffness: 200 });
  }

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={!unlocked}
      style={animatedStyle}
      className={`relative h-[72px] w-[72px] items-center justify-center rounded-2xl border-2 ${
        completed
          ? 'border-green-400/60 bg-green-400/15'
          : isNext
            ? 'border-amber-400 bg-amber-400/20 shadow-lg shadow-amber-400/20'
            : unlocked
              ? 'border-cyan-400/50 bg-[#1a1040]'
              : 'border-slate-700/80 bg-[#0d0b1f]'
      }`}
      accessibilityRole="button"
      accessibilityLabel={unlocked ? `Level ${level}` : `Level ${level} locked`}
      accessibilityState={{ disabled: !unlocked }}>
      {isNext ? (
        <View className="absolute -right-1 -top-1 rounded-full bg-amber-400 px-1.5 py-0.5">
          <Text className="text-[9px] font-bold text-[#12122b]">GO</Text>
        </View>
      ) : null}

      {unlocked ? (
        completed ? (
          <>
            <Ionicons name="checkmark-circle" size={22} color="#4ade80" />
            <Text className="mt-0.5 text-[10px] font-semibold text-green-400">
              {formatBestScore(bestMoves)}
            </Text>
          </>
        ) : (
          <>
            <Text className={`text-xl font-bold ${isNext ? 'text-amber-300' : 'text-white'}`}>
              {level}
            </Text>
            <Text className="mt-0.5 text-[10px] text-slate-500">
              Best {formatBestScore(bestMoves)}
            </Text>
          </>
        )
      ) : (
        <>
          <Ionicons name="lock-closed" size={18} color="#475569" />
          <Text className="mt-1 text-[10px] text-slate-600">{level}</Text>
        </>
      )}
    </AnimatedPressable>
  );
}
