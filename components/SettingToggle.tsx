import React from 'react';
import { Switch, Text, View } from 'react-native';

interface SettingToggleProps {
  title: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

export function SettingToggle({ title, description, value, onValueChange }: SettingToggleProps) {
  return (
    <View className="flex-row items-center justify-between py-3">
      <View className="mr-4 flex-1">
        <Text className="text-base font-semibold text-white">{title}</Text>
        <Text className="mt-1 text-sm text-slate-400">{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#2a1f5c', true: '#22d3ee80' }}
        thumbColor={value ? '#22d3ee' : '#94a3b8'}
        ios_backgroundColor="#2a1f5c"
      />
    </View>
  );
}
