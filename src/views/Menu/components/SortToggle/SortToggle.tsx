import React, { memo, useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolateColor,
} from 'react-native-reanimated';
import { SortTogglePropsType } from './types';

const TRACK_WIDTH = 50;
const TRACK_HEIGHT = 30;
const KNOB_SIZE = 26;
const TRACK_PADDING = 2;
const KNOB_TRAVEL = TRACK_WIDTH - KNOB_SIZE - TRACK_PADDING * 2;

const TRACK_INACTIVE = '#ccc';
const TRACK_ACTIVE = '#007AFF';

const SortToggle: React.FC<SortTogglePropsType> = ({
  valueToggle,
  onToggle,
}) => {
  const progress = useSharedValue(valueToggle ? 1 : 0);

  useEffect(() => {
    progress.value = withSpring(valueToggle ? 1 : 0, {
      damping: 15,
      stiffness: 150,
    });
  }, [valueToggle, progress]);

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [TRACK_INACTIVE, TRACK_ACTIVE],
    ),
  }));

  const knobStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * KNOB_TRAVEL }],
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.label}>A-Z</Text>
      <Pressable
        testID="sort-toggle"
        onPress={() => onToggle(!valueToggle)}
        hitSlop={8}
      >
        <Animated.View style={[styles.track, trackStyle]}>
          <Animated.View style={[styles.knob, knobStyle]} />
        </Animated.View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: 14,
  },
  track: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    padding: TRACK_PADDING,
    justifyContent: 'center',
  },
  knob: {
    width: KNOB_SIZE,
    height: KNOB_SIZE,
    borderRadius: KNOB_SIZE / 2,
    backgroundColor: '#fff',
  },
});

export default memo(SortToggle);
