import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

interface LifelineButtonProps {
  available: boolean;
  active: boolean;
  onPress: () => void;
}

export function LifelineButton({ available, active, onPress }: LifelineButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!available}
      className={`items-center justify-center rounded-2xl border px-3 py-3 ${
        active
          ? 'border-purple-400 bg-purple-400/20'
          : available
            ? 'border-purple-400/40 bg-[#1a1040]'
            : 'border-slate-700 bg-[#0d0b1f] opacity-50'
      }`}
      style={{ minWidth: 88 }}
      accessibilityRole="button"
      accessibilityLabel="Lifeline"
      accessibilityState={{ disabled: !available, selected: active }}>
      <Ionicons
        name={available ? 'flashlight' : 'flashlight-outline'}
        size={20}
        color={active ? '#c084fc' : available ? '#a855f7' : '#64748b'}
      />
      <Text
        className={`mt-1 text-xs font-semibold ${active ? 'text-purple-300' : available ? 'text-white' : 'text-slate-500'}`}>
        Lifeline
      </Text>
      <Text className="text-[9px] text-slate-500">{available ? '1 use' : 'Used'}</Text>
    </Pressable>
  );
}
