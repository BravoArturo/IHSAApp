import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { SkeletonChartPropType } from './types';

const PULSE_DURATION_MS = 500;
const OPACITY_MIN = 0.3;
const OPACITY_MAX = 1;
const COLOR_FROM = '#3B82F6';
const COLOR_TO = '#A855F7';

const SkeletonChart: React.FC<SkeletonChartPropType> = () => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: PULSE_DURATION_MS }),
      -1,
      true,
    );
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: OPACITY_MIN + (OPACITY_MAX - OPACITY_MIN) * progress.value,
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [COLOR_FROM, COLOR_TO],
    ),
  }));

  return <Animated.View style={[styles.container, animatedStyle]} />;
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
});

export default SkeletonChart;
