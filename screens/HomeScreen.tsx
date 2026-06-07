import React from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 bg-slate-950 px-6"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <View className="flex-1 items-center justify-center">
        <Text className="text-3xl font-bold tracking-widest text-amber-300">LIGHT OUT</Text>
        <Text className="mt-3 text-center text-base text-slate-400">
          Welcome! The game board will appear here.
        </Text>

        <View className="mt-10 rounded-2xl border border-amber-400/30 bg-slate-900 px-8 py-4">
          <Text className="text-lg font-semibold text-amber-300">Play</Text>
        </View>
      </View>
    </View>
  );
}
