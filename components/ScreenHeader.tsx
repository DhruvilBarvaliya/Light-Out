import { Ionicons } from '@expo/vector-icons';
import React, { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ScreenHeaderProps {
  title: string;
  onBack: () => void;
  rightAction?: ReactNode;
}

export function ScreenHeader({ title, onBack, rightAction }: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-row items-center justify-between px-6 pb-4"
      style={{ paddingTop: insets.top + 8 }}>
      <Pressable
        onPress={onBack}
        className="h-10 w-10 items-center justify-center rounded-full border border-cyan-400/30 bg-[#1a1040]"
        accessibilityRole="button"
        accessibilityLabel="Go back">
        <Ionicons name="arrow-back" size={20} color="#22d3ee" />
      </Pressable>

      <Text className="text-lg font-bold text-white">{title}</Text>

      <View className="h-10 w-10 items-center justify-center">{rightAction}</View>
    </View>
  );
}
