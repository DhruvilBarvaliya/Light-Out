import React, { useEffect } from 'react';
import { Image, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

interface SplashScreenProps {
  onFinish: () => void;
}

const GRID_SIZE = 5;
const SPLASH_DURATION_MS = 2500;
const LOGO = require('../assets/lightoutLogo.png');

function LightCell({ index, delay }: { index: number; delay: number }) {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 600, easing: Easing.out(Easing.quad) }),
          withTiming(0.25, { duration: 600, easing: Easing.in(Easing.quad) })
        ),
        -1,
        true
      )
    );
  }, [delay, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const isCenter = index === Math.floor((GRID_SIZE * GRID_SIZE) / 2);

  return (
    <Animated.View
      style={animatedStyle}
      className={`h-10 w-10 rounded-md ${isCenter ? 'bg-amber-300' : 'bg-amber-400'}`}
    />
  );
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.6);
  const logoRotate = useSharedValue(-8);
  const subtitleOpacity = useSharedValue(0);

  useEffect(() => {
    logoOpacity.value = withTiming(1, { duration: 700 });
    logoScale.value = withSpring(1, { damping: 12, stiffness: 120 });
    logoRotate.value = withSequence(
      withSpring(4, { damping: 8, stiffness: 100 }),
      withSpring(0, { damping: 14, stiffness: 140 })
    );
    subtitleOpacity.value = withDelay(500, withTiming(1, { duration: 600 }));

    const timer = setTimeout(onFinish, SPLASH_DURATION_MS);
    return () => clearTimeout(timer);
  }, [onFinish, logoOpacity, logoRotate, logoScale, subtitleOpacity]);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }, { rotate: `${logoRotate.value}deg` }],
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  return (
    <View className="flex-1 items-center justify-center bg-[#12122b] px-8">
      <Animated.View style={logoStyle} className="mb-8 overflow-hidden rounded-3xl shadow-lg shadow-cyan-500/30">
        <Image
          source={LOGO}
          className="h-28 w-28"
          resizeMode="cover"
          accessibilityLabel="LightOut logo"
        />
      </Animated.View>

      <Animated.Text style={subtitleStyle} className="mb-8 text-base text-slate-400">
        Turn off all the lights
      </Animated.Text>

      <View className="flex-row flex-wrap justify-center gap-2" style={{ width: GRID_SIZE * 48 }}>
        {Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, index) => (
          <LightCell key={index} index={index} delay={index * 80} />
        ))}
      </View>
    </View>
  );
}
