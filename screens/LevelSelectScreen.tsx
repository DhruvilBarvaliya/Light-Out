import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  View,
} from 'react-native';

import { ChapterTabs } from 'components/ChapterTabs';
import { LevelCard } from 'components/LevelCard';
import { LevelPagination } from 'components/LevelPagination';
import { ScreenHeader } from 'components/ScreenHeader';
import {
  CHAPTERS,
  findNextPlayableLevel,
  getChapterProgress,
  getPageLevels,
  LEVELS_PER_PAGE,
  TOTAL_PAGES,
} from 'constants/chapters';
import { useProgress } from 'context/ProgressContext';
import { useScores } from 'context/ScoresContext';
import {
  areStarterLevelsComplete,
  INITIAL_UNLOCKED_LEVELS,
  isLevelUnlocked,
  TOTAL_LEVELS,
} from 'utils/lightsOut';

interface LevelSelectScreenProps {
  onBack: () => void;
  onSelectLevel: (level: number) => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function LevelSelectScreen({ onBack, onSelectLevel }: LevelSelectScreenProps) {
  const { completedLevels, isLevelCompleted } = useProgress();
  const { getLevelBest } = useScores();
  const [currentPage, setCurrentPage] = useState(0);
  const listRef = useRef<FlatList<number>>(null);

  const starterLevelsComplete = areStarterLevelsComplete(completedLevels);
  const progressPercent = Math.round((completedLevels.length / TOTAL_LEVELS) * 100);

  const pageProgress = useMemo(
    () => Array.from({ length: TOTAL_PAGES }, (_, index) => getChapterProgress(index, completedLevels)),
    [completedLevels]
  );

  const nextPlayableLevel = useMemo(
    () => findNextPlayableLevel(completedLevels, (level) => isLevelUnlocked(level, completedLevels)),
    [completedLevels]
  );

  const goToPage = useCallback((page: number, animated = true) => {
    const safePage = Math.max(0, Math.min(page, TOTAL_PAGES - 1));
    setCurrentPage(safePage);
    listRef.current?.scrollToIndex({ index: safePage, animated });
  }, []);

  useEffect(() => {
    if (nextPlayableLevel) {
      const page = Math.floor((nextPlayableLevel - 1) / LEVELS_PER_PAGE);
      goToPage(page, false);
    }
  }, [goToPage, nextPlayableLevel]);

  const handleMomentumScrollEnd = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const page = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setCurrentPage(page);
  }, []);

  function renderPage(pageIndex: number) {
    const chapter = CHAPTERS[pageIndex];
    const levels = getPageLevels(pageIndex);
    const chapterStats = pageProgress[pageIndex];

    return (
      <View style={{ width: SCREEN_WIDTH }} className="px-6">
        <View className="mb-5 rounded-2xl border border-cyan-400/20 bg-[#1a1040] p-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
                Chapter {pageIndex + 1}
              </Text>
              <Text className="mt-1 text-xl font-bold text-white">{chapter.name}</Text>
              <Text className="mt-1 text-sm text-slate-400">{chapter.subtitle}</Text>
            </View>
            <View className="items-center rounded-xl bg-[#12122b] px-3 py-2">
              <Text className="text-lg font-bold text-white">
                {chapterStats.completed}/{chapterStats.total}
              </Text>
              <Text className="text-[10px] text-slate-500">cleared</Text>
            </View>
          </View>

          <View className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
            <View
              className="h-full rounded-full bg-cyan-400"
              style={{ width: `${(chapterStats.completed / chapterStats.total) * 100}%` }}
            />
          </View>
        </View>

        <View className="flex-row flex-wrap justify-center gap-3">
          {levels.map((level) => (
            <LevelCard
              key={level}
              level={level}
              unlocked={isLevelUnlocked(level, completedLevels)}
              completed={isLevelCompleted(level)}
              isNext={level === nextPlayableLevel}
              bestMoves={getLevelBest(level)}
              onPress={() => onSelectLevel(level)}
            />
          ))}
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#12122b]">
      <ScreenHeader title="Level Challenge" onBack={onBack} />

      <View className="mx-6 mb-4 rounded-2xl border border-cyan-400/15 bg-[#1a1040] p-4">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <Ionicons name="trophy" size={18} color="#fbbf24" />
            <Text className="text-sm font-semibold text-white">Overall Progress</Text>
          </View>
          <Text className="text-sm font-bold text-cyan-300">{progressPercent}%</Text>
        </View>

        <View className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-800">
          <View className="h-full rounded-full bg-amber-400" style={{ width: `${progressPercent}%` }} />
        </View>

        <Text className="mt-3 text-center text-xs text-slate-400">
          {starterLevelsComplete
            ? 'All chapters unlocked — conquer every puzzle!'
            : `Complete levels 1-${INITIAL_UNLOCKED_LEVELS} to unlock chapters 2-6.`}
        </Text>
      </View>

      <ChapterTabs
        currentPage={currentPage}
        onSelectPage={goToPage}
        pageProgress={pageProgress}
      />

      <FlatList
        ref={listRef}
        data={Array.from({ length: TOTAL_PAGES }, (_, index) => index)}
        keyExtractor={(item) => `page-${item}`}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        getItemLayout={(_, index) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * index,
          index,
        })}
        renderItem={({ item }) => renderPage(item)}
      />

      <LevelPagination
        currentPage={currentPage}
        totalPages={TOTAL_PAGES}
        onPrevious={() => goToPage(currentPage - 1)}
        onNext={() => goToPage(currentPage + 1)}
        onSelectPage={goToPage}
      />
    </View>
  );
}
