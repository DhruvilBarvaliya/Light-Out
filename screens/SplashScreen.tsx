import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

interface SplashScreenProps {
  onFinish: () => void;
}

const GRID_SIZE = 5;
const SPLASH_DURATION_MS = 2500;

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

  const isCenter = index === Math.floor(GRID_SIZE * GRID_SIZE / 2);

  return (
    <Animated.View
      style={animatedStyle}
      className={`h-10 w-10 rounded-md ${isCenter ? 'bg-amber-300' : 'bg-amber-400'}`}
    />
  );
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const titleOpacity = useSharedValue(0);
  const titleScale = useSharedValue(0.9);

  useEffect(() => {
    titleOpacity.value = withTiming(1, { duration: 800 });
    titleScale.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.back(1.2)) });

    const timer = setTimeout(onFinish, SPLASH_DURATION_MS);
    return () => clearTimeout(timer);
  }, [onFinish, titleOpacity, titleScale]);

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ scale: titleScale.value }],
  }));

  return (
    <View className="flex-1 items-center justify-center bg-slate-950 px-8">
      <Animated.View style={titleStyle} className="mb-10 items-center">
        <Text className="text-4xl font-bold tracking-widest text-amber-300">LIGHT OUT</Text>
        <Text className="mt-2 text-base text-slate-400">Turn off all the lights</Text>
      </Animated.View>

      <View className="flex-row flex-wrap justify-center gap-2" style={{ width: GRID_SIZE * 48 }}>
        {Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, index) => (
          <LightCell key={index} index={index} delay={index * 80} />
        ))}
      </View>
    </View>
  );
}
