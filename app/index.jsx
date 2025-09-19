import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

export default function LandingPage() {
  const router = useRouter();
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1); // 👈 for fade-out

  // ✅ Pan gesture (anywhere on screen)
  const swipeGesture = Gesture.Pan().onEnd((e) => {
    if (e.translationY < -50) {
      // swipe up detected
      translateY.value = withTiming(-500, { duration: 500 });
      opacity.value = withTiming(0, { duration: 500 }, (finished) => {
        if (finished) {
          runOnJS(router.push)("/login");
        }
      });
    }
  });

  // Arrow bounce animation
  const arrowOffset = useSharedValue(0);
  React.useEffect(() => {
    arrowOffset.value = withRepeat(
      withSequence(withSpring(-10), withSpring(0)),
      -1,
      true
    );
  }, []);

  const arrowStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: arrowOffset.value }],
  }));

  // Landing content slide + fade animation
  const contentStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GestureDetector gesture={swipeGesture}>
        <Animated.View style={[styles.container, contentStyle]}>
          {/* Center content */}
          <View style={styles.center}>
            <Text style={styles.headline}>Book Your Next Experience</Text>
            <Text style={styles.subheadline}>
              Discover concerts, parties, and events near you 🎶✨
            </Text>
          </View>

          {/* Bottom arrow + swipe text */}
          <View style={styles.bottom}>
            <Animated.Text style={[styles.arrow, arrowStyle]}>↑↑↑</Animated.Text>
            <Text style={styles.swipeText}>Swipe up to get started</Text>
          </View>
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
    justifyContent: "space-between", // push content + footer apart
    alignItems: "center",
    paddingVertical: 60,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  headline: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
  },
  subheadline: {
    fontSize: 16,
    color: "#ccc",
    textAlign: "center",
  },
  bottom: {
    alignItems: "center",
    marginBottom: 20,
  },
  arrow: {
    fontSize: 28,
    color: "#fff",
  },
  swipeText: {
    fontSize: 14,
    color: "#aaa",
    marginTop: 5,
  },
});
