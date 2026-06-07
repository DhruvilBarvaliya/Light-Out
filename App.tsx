import { useCallback, useEffect, useState } from 'react';
import * as SplashScreenNative from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { HomeScreen } from 'screens/HomeScreen';
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
      {showSplash ? <SplashScreen onFinish={handleSplashFinish} /> : <HomeScreen />}
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}
