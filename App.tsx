import { useCallback, useEffect, useState } from 'react';
import * as SplashScreenNative from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ProgressProvider } from 'context/ProgressContext';
import { ScoresProvider } from 'context/ScoresContext';
import { SettingsProvider } from 'context/SettingsContext';
import { AppNavigator } from 'navigation/AppNavigator';
import { SplashScreen } from 'screens/SplashScreen';

import './global.css';

SplashScreenNative.preventAutoHideAsync();

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
      } finally {
        setAppReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (appReady) {
      SplashScreenNative.hideAsync();
    }
  }, [appReady]);

  const handleSplashFinish = useCallback(() => {
    setShowSplash(false);
  }, []);

  if (!appReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <ProgressProvider>
          <ScoresProvider>
            {showSplash ? <SplashScreen onFinish={handleSplashFinish} /> : <AppNavigator />}
            <StatusBar style="light" />
          </ScoresProvider>
        </ProgressProvider>
      </SettingsProvider>
    </SafeAreaProvider>
  );
}
