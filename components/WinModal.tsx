import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useEffect } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { formatBestScore } from 'utils/formatScore';

interface WinModalProps {
  visible: boolean;
  title: string;
  subtitle: string;
  moves: number;
  bestMoves: number | null;
  isNewRecord?: boolean;
  primaryLabel: string;
  onPrimaryAction: () => void;
}

export function WinModal({
  visible,
  title,
  subtitle,
  moves,
  bestMoves,
  isNewRecord = false,
  primaryLabel,
  onPrimaryAction,
}: WinModalProps) {
  const backdropOpacity = useSharedValue(0);
  const cardScale = useSharedValue(0.6);
  const cardOpacity = useSharedValue(0);
  const iconScale = useSharedValue(0);
  const iconRotate = useSharedValue(-20);
  const glowScale = useSharedValue(0.8);
  const glowOpacity = useSharedValue(0);

  useEffect(() => {
    if (!visible) {
      backdropOpacity.value = 0;
      cardScale.value = 0.6;
      cardOpacity.value = 0;
      iconScale.value = 0;
      iconRotate.value = -20;
      glowScale.value = 0.8;
      glowOpacity.value = 0;
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    backdropOpacity.value = withTiming(1, { duration: 250 });
    cardOpacity.value = withTiming(1, { duration: 300 });
    cardScale.value = withSpring(1, { damping: 12, stiffness: 140 });
    iconScale.value = withDelay(150, withSpring(1, { damping: 8, stiffness: 180 }));
    iconRotate.value = withDelay(
      150,
      withSequence(
        withSpring(12, { damping: 6, stiffness: 120 }),
        withSpring(0, { damping: 10, stiffness: 160 })
      )
    );
    glowOpacity.value = withDelay(200, withTiming(0.6, { duration: 400 }));
    glowScale.value = withDelay(
      200,
      withRepeat(
        withSequence(
          withTiming(1.15, { duration: 900, easing: Easing.inOut(Easing.quad) }),
          withTiming(0.95, { duration: 900, easing: Easing.inOut(Easing.quad) })
        ),
        -1,
        true
      )
    );
  }, [
    backdropOpacity,
    cardOpacity,
    cardScale,
    glowOpacity,
    glowScale,
    iconRotate,
    iconScale,
    visible,
  ]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const cardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ scale: cardScale.value }],
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }, { rotate: `${iconRotate.value}deg` }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
    transform: [{ scale: glowScale.value }],
  }));

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onPrimaryAction}>
      <Animated.View
        style={backdropStyle}
        className="flex-1 items-center justify-center bg-black/75 px-6">
        <Animated.View
          style={glowStyle}
          className="absolute h-64 w-64 rounded-full bg-amber-400/20"
        />

        <Animated.View
          style={cardStyle}
          className="w-full max-w-sm overflow-hidden rounded-3xl border border-amber-400/30 bg-[#1a1040]">
          <View className="items-center px-6 pb-6 pt-8">
            <Animated.View style={iconStyle}>
              <View className="h-20 w-20 items-center justify-center rounded-full bg-amber-400/20">
                <Ionicons name="trophy" size={42} color="#fbbf24" />
              </View>
            </Animated.View>

            <Text className="mt-5 text-2xl font-bold text-white">{title}</Text>
            <Text className="mt-2 text-center text-sm leading-5 text-slate-400">{subtitle}</Text>

            <View className="mt-6 w-full flex-row gap-3">
              <View className="flex-1 items-center rounded-2xl border border-cyan-400/20 bg-[#12122b] py-3">
                <Text className="text-xs uppercase tracking-wider text-slate-500">Moves</Text>
                <Text className="mt-1 text-xl font-bold text-white">{moves}</Text>
              </View>
              <View className="flex-1 items-center rounded-2xl border border-amber-400/20 bg-[#12122b] py-3">
                <Text className="text-xs uppercase tracking-wider text-slate-500">Best</Text>
                <Text className="mt-1 text-xl font-bold text-amber-300">
                  {formatBestScore(bestMoves)}
                </Text>
              </View>
            </View>

            {isNewRecord ? (
              <View className="mt-4 flex-row items-center gap-2 rounded-full border border-green-400/30 bg-green-400/10 px-4 py-2">
                <Ionicons name="sparkles" size={14} color="#4ade80" />
                <Text className="text-sm font-semibold text-green-400">New best record!</Text>
              </View>
            ) : null}

            <Pressable
              onPress={onPrimaryAction}
              className="mt-6 w-full items-center rounded-2xl border border-amber-400/40 bg-amber-400/15 py-4"
              accessibilityRole="button"
              accessibilityLabel={primaryLabel}>
              <Text className="text-base font-bold text-amber-300">{primaryLabel}</Text>
            </Pressable>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}
