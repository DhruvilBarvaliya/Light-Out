import React, { useState } from 'react';

import { CasualGameScreen } from 'screens/CasualGameScreen';
import { HomeScreen } from 'screens/HomeScreen';
import { LevelGameScreen } from 'screens/LevelGameScreen';
import { LevelSelectScreen } from 'screens/LevelSelectScreen';

import { AppScreen } from './types';

export function AppNavigator() {
  const [screen, setScreen] = useState<AppScreen>('home');
  const [activeLevel, setActiveLevel] = useState<number | null>(null);

  if (screen === 'casual') {
    return <CasualGameScreen onBack={() => setScreen('home')} />;
  }

  if (screen === 'levels') {
    return (
      <LevelSelectScreen
        onBack={() => setScreen('home')}
        onSelectLevel={(level) => {
          setActiveLevel(level);
          setScreen('level');
        }}
      />
    );
  }

  if (screen === 'level' && activeLevel !== null) {
    return (
      <LevelGameScreen
        level={activeLevel}
        onBack={() => {
          setScreen('levels');
          setActiveLevel(null);
        }}
      />
    );
  }

  return (
    <HomeScreen
      onCasualPlay={() => setScreen('casual')}
      onLevelChallenge={() => setScreen('levels')}
    />
  );
}
