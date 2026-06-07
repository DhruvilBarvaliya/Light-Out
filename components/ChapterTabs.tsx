import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { CHAPTERS, TOTAL_PAGES } from 'constants/chapters';

interface ChapterTabsProps {
  currentPage: number;
  onSelectPage: (page: number) => void;
  pageProgress: { completed: number; total: number }[];
}

export function ChapterTabs({ currentPage, onSelectPage, pageProgress }: ChapterTabsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-2 px-6 pb-3">
      {CHAPTERS.slice(0, TOTAL_PAGES).map((chapter, index) => {
        const isActive = currentPage === index;
        const progress = pageProgress[index];
        const isChapterDone = progress.completed === progress.total;

        return (
          <Pressable
            key={chapter.name}
            onPress={() => onSelectPage(index)}
            className={`min-w-[108px] rounded-2xl border px-3 py-2.5 ${
              isActive
                ? 'border-cyan-400 bg-cyan-400/15'
                : 'border-slate-700 bg-[#1a1040]/60'
            }`}
            accessibilityRole="button"
            accessibilityLabel={`Chapter ${index + 1}, ${chapter.name}`}
            accessibilityState={{ selected: isActive }}>
            <Text
              className={`text-[10px] font-semibold uppercase tracking-wider ${
                isActive ? 'text-cyan-300' : 'text-slate-500'
              }`}>
              Ch. {index + 1}
            </Text>
            <Text className={`text-sm font-bold ${isActive ? 'text-white' : 'text-slate-300'}`}>
              {chapter.name}
            </Text>
            <View className="mt-2 h-1 overflow-hidden rounded-full bg-slate-800">
              <View
                className={`h-full rounded-full ${isChapterDone ? 'bg-green-400' : 'bg-cyan-400'}`}
                style={{ width: `${(progress.completed / progress.total) * 100}%` }}
              />
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
