import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GameRules } from 'components/GameRules';
import { SettingsModal } from 'components/SettingsModal';

interface HomeScreenProps {
  onCasualPlay: () => void;
  onLevelChallenge: () => void;
}

export function HomeScreen({ onCasualPlay, onLevelChallenge }: HomeScreenProps) {
  const insets = useSafeAreaInsets();
  const [settingsVisible, setSettingsVisible] = useState(false);

  return (
    <View
      className="flex-1 bg-[#12122b] px-6"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <Pressable
        onPress={() => setSettingsVisible(true)}
        className="absolute right-6 z-10 h-11 w-11 items-center justify-center rounded-full border border-cyan-400/30 bg-[#1a1040]"
        style={{ top: insets.top + 8 }}
        accessibilityLabel="Open settings"
        accessibilityRole="button">
        <Ionicons name="settings-outline" size={22} color="#22d3ee" />
      </Pressable>

      <View className="items-center pb-3 pt-2">
        <Text className="text-3xl font-bold tracking-widest text-white">Light Out</Text>
        <Text className="mt-1 text-center text-sm text-slate-400">Puzzle your way to darkness</Text>
      </View>

      <View className="min-h-0 flex-1">
        <GameRules />
      </View>

      <View className="gap-3 pt-4">
        <Pressable
          onPress={onCasualPlay}
          className="w-full flex-row items-center justify-center gap-2 rounded-2xl border border-amber-400/30 bg-[#1a1040] py-4"
          accessibilityRole="button"
          accessibilityLabel="Casual play">
          <Ionicons name="shuffle-outline" size={20} color="#fbbf24" />
          <View>
            <Text className="text-center text-lg font-semibold text-white">Casual Play</Text>
            <Text className="text-center text-xs text-slate-400">3×3 · 5×5 · 7×7 grids</Text>
          </View>
        </Pressable>

        <Pressable
          onPress={onLevelChallenge}
          className="w-full flex-row items-center justify-center gap-2 rounded-2xl border border-cyan-400/30 bg-[#1a1040] py-4"
          accessibilityRole="button"
          accessibilityLabel="Level challenge">
          <Ionicons name="trophy-outline" size={20} color="#22d3ee" />
          <View>
            <Text className="text-center text-lg font-semibold text-white">Level Challenge</Text>
            <Text className="text-center text-xs text-slate-400">60 levels · earn achievements</Text>
          </View>
        </Pressable>
      </View>

      <SettingsModal visible={settingsVisible} onClose={() => setSettingsVisible(false)} />
    </View>
  );
}
