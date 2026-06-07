import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

interface WinBannerProps {
  message: string;
}

export function WinBanner({ message }: WinBannerProps) {
  return (
    <View className="mt-6 flex-row items-center justify-center gap-2 rounded-xl border border-green-400/30 bg-green-400/10 px-4 py-3">
      <Ionicons name="checkmark-circle" size={20} color="#4ade80" />
      <Text className="text-base font-semibold text-green-400">{message}</Text>
    </View>
  );
}
