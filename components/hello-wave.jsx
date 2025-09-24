import Animated, { useSharedValue, useAnimatedStyle, withSequence, withTiming } from 'react-native-reanimated';
import { useEffect } from 'react';
import { Text } from 'react-native';

export function HelloWave() {
  const rotate = useSharedValue(0);

  useEffect(() => {
    // Animate the hand waving back and forth
    rotate.value = withSequence(
      withTiming(25, { duration: 150 }),
      withTiming(-25, { duration: 150 }),
      withTiming(25, { duration: 150 }),
      withTiming(0, { duration: 150 })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value}deg` }],
  }));

  return (
    <Animated.Text style={[{ fontSize: 28, lineHeight: 32, marginTop: -6 }, animatedStyle]}>
      👋
    </Animated.Text>
  );
}
