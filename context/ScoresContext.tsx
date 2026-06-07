import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { CasualDifficulty } from 'constants/gridConfig';

const CASUAL_BEST_KEY = '@lightout/casual-best-moves';
const LEVEL_BEST_KEY = '@lightout/level-best-moves';

type CasualBestScores = Partial<Record<CasualDifficulty, number>>;
type LevelBestScores = Record<string, number>;

interface ScoresContextValue {
  isReady: boolean;
  getCasualBest: (difficulty: CasualDifficulty) => number | null;
  getLevelBest: (level: number) => number | null;
  recordCasualScore: (difficulty: CasualDifficulty, moves: number) => boolean;
  recordLevelScore: (level: number, moves: number) => boolean;
}

const ScoresContext = createContext<ScoresContextValue | null>(null);

function parseCasualBestScores(raw: string | null): CasualBestScores {
  if (!raw) {
    return {};
  }

  try {
    return JSON.parse(raw) as CasualBestScores;
  } catch {
    return {};
  }
}

function parseLevelBestScores(raw: string | null): LevelBestScores {
  if (!raw) {
    return {};
  }

  try {
    return JSON.parse(raw) as LevelBestScores;
  } catch {
    return {};
  }
}

function isBetterScore(current: number | undefined, moves: number): boolean {
  return current === undefined || moves < current;
}

export function ScoresProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [casualBest, setCasualBest] = useState<CasualBestScores>({});
  const [levelBest, setLevelBest] = useState<LevelBestScores>({});

  useEffect(() => {
    async function loadScores() {
      const [casualRaw, levelRaw] = await Promise.all([
        AsyncStorage.getItem(CASUAL_BEST_KEY),
        AsyncStorage.getItem(LEVEL_BEST_KEY),
      ]);

      setCasualBest(parseCasualBestScores(casualRaw));
      setLevelBest(parseLevelBestScores(levelRaw));
      setIsReady(true);
    }

    loadScores();
  }, []);

  const getCasualBest = useCallback(
    (difficulty: CasualDifficulty) => casualBest[difficulty] ?? null,
    [casualBest]
  );

  const getLevelBest = useCallback(
    (level: number) => levelBest[String(level)] ?? null,
    [levelBest]
  );

  const recordCasualScore = useCallback((difficulty: CasualDifficulty, moves: number) => {
    let isNewRecord = false;

    setCasualBest((current) => {
      if (!isBetterScore(current[difficulty], moves)) {
        return current;
      }

      isNewRecord = true;
      const next = { ...current, [difficulty]: moves };
      AsyncStorage.setItem(CASUAL_BEST_KEY, JSON.stringify(next));
      return next;
    });

    return isNewRecord;
  }, []);

  const recordLevelScore = useCallback((level: number, moves: number) => {
    const key = String(level);
    let isNewRecord = false;

    setLevelBest((current) => {
      if (!isBetterScore(current[key], moves)) {
        return current;
      }

      isNewRecord = true;
      const next = { ...current, [key]: moves };
      AsyncStorage.setItem(LEVEL_BEST_KEY, JSON.stringify(next));
      return next;
    });

    return isNewRecord;
  }, []);

  const value = useMemo(
    () => ({
      isReady,
      getCasualBest,
      getLevelBest,
      recordCasualScore,
      recordLevelScore,
    }),
    [isReady, getCasualBest, getLevelBest, recordCasualScore, recordLevelScore]
  );

  return <ScoresContext.Provider value={value}>{children}</ScoresContext.Provider>;
}

export function useScores() {
  const context = useContext(ScoresContext);

  if (!context) {
    throw new Error('useScores must be used within a ScoresProvider');
  }

  return context;
}
