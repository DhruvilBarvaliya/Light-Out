import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface LevelPaginationProps {
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
  onSelectPage: (page: number) => void;
}

export function LevelPagination({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
  onSelectPage,
}: LevelPaginationProps) {
  const insets = useSafeAreaInsets();
  const canGoPrevious = currentPage > 0;
  const canGoNext = currentPage < totalPages - 1;

  return (
    <View
      className="flex-row items-center justify-between border-t border-cyan-400/10 bg-[#12122b] px-6 pt-3"
      style={{ paddingBottom: Math.max(insets.bottom, 12) + 12 }}>
      <Pressable
        onPress={onPrevious}
        disabled={!canGoPrevious}
        className={`h-11 w-11 items-center justify-center rounded-full border ${
          canGoPrevious ? 'border-cyan-400/40 bg-[#1a1040]' : 'border-slate-800 bg-[#0d0b1f] opacity-40'
        }`}
        accessibilityRole="button"
        accessibilityLabel="Previous page"
        accessibilityState={{ disabled: !canGoPrevious }}>
        <Ionicons name="chevron-back" size={20} color={canGoPrevious ? '#22d3ee' : '#475569'} />
      </Pressable>

      <View className="items-center">
        <View className="mb-2 flex-row items-center gap-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <Pressable
              key={index}
              onPress={() => onSelectPage(index)}
              accessibilityRole="button"
              accessibilityLabel={`Page ${index + 1}`}>
              <View
                className={`rounded-full ${
                  currentPage === index ? 'h-2.5 w-6 bg-cyan-400' : 'h-2 w-2 bg-slate-600'
                }`}
              />
            </Pressable>
          ))}
        </View>
        <Text className="text-xs text-slate-500">
          Page {currentPage + 1} of {totalPages}
        </Text>
      </View>

      <Pressable
        onPress={onNext}
        disabled={!canGoNext}
        className={`h-11 w-11 items-center justify-center rounded-full border ${
          canGoNext ? 'border-cyan-400/40 bg-[#1a1040]' : 'border-slate-800 bg-[#0d0b1f] opacity-40'
        }`}
        accessibilityRole="button"
        accessibilityLabel="Next page"
        accessibilityState={{ disabled: !canGoNext }}>
        <Ionicons name="chevron-forward" size={20} color={canGoNext ? '#22d3ee' : '#475569'} />
      </Pressable>
    </View>
  );
}
