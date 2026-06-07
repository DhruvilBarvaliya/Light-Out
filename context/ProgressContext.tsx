import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

interface ProgressContextValue {
  completedLevels: number[];
  completeLevel: (level: number) => void;
  isLevelCompleted: (level: number) => boolean;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);

  const completeLevel = useCallback((level: number) => {
    setCompletedLevels((current) => {
      if (current.includes(level)) {
        return current;
      }

      return [...current, level].sort((a, b) => a - b);
    });
  }, []);

  const isLevelCompleted = useCallback(
    (level: number) => completedLevels.includes(level),
    [completedLevels]
  );

  const value = useMemo(
    () => ({
      completedLevels,
      completeLevel,
      isLevelCompleted,
    }),
    [completedLevels, completeLevel, isLevelCompleted]
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const context = useContext(ProgressContext);

  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }

  return context;
}
