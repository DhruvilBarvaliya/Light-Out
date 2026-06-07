import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, Pressable, Text, View } from 'react-native';

import { useSettings } from 'context/SettingsContext';

import { SettingToggle } from './SettingToggle';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

export function SettingsModal({ visible, onClose }: SettingsModalProps) {
  const { musicEnabled, soundEnabled, setMusicEnabled, setSoundEnabled } = useSettings();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable className="flex-1 items-center justify-center bg-black/60 px-6" onPress={onClose}>
        <Pressable
          className="w-full max-w-sm rounded-2xl border border-cyan-400/20 bg-[#1a1040] p-5"
          onPress={(event) => event.stopPropagation()}>
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-xl font-bold text-white">Settings</Text>
            <Pressable
              onPress={onClose}
              className="h-9 w-9 items-center justify-center rounded-full bg-[#12122b]"
              accessibilityLabel="Close settings"
              accessibilityRole="button">
              <Ionicons name="close" size={20} color="#94a3b8" />
            </Pressable>
          </View>

          <Text className="mb-2 text-sm text-slate-400">Audio preferences</Text>

          <SettingToggle
            title="Music"
            description="Background music during gameplay"
            value={musicEnabled}
            onValueChange={setMusicEnabled}
          />

          <View className="my-1 h-px bg-cyan-400/10" />

          <SettingToggle
            title="Sound effects"
            description="Tap and win sounds"
            value={soundEnabled}
            onValueChange={setSoundEnabled}
          />

          <Text className="mt-4 text-center text-xs text-slate-500">
            Audio will be available in a future update.
          </Text>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
