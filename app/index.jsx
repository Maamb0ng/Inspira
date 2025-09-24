import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect } from "react";
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
  const opacity = useSharedValue(1);

  const swipeGesture = Gesture.Pan().onEnd((e) => {
    if (e.translationY < -50) {
      translateY.value = withTiming(-500, { duration: 500 });
      opacity.value = withTiming(0, { duration: 500 }, (finished) => {
        if (finished) {
          runOnJS(router.push)("login");
        }
      });
    }
  });

  const arrowOffset = useSharedValue(0);
  useEffect(() => {
    arrowOffset.value = withRepeat(
      withSequence(withSpring(-10), withSpring(0)),
      -1,
      true
    );
  }, []);

  const arrowStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: arrowOffset.value }],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GestureDetector gesture={swipeGesture}>
        <Animated.View style={[styles.container, contentStyle]}>
          {/* Gradient background (deep navy tones) */}
          <LinearGradient
            colors={["#0D1B2A", "#1B263B", "#0D1B2A"]}
            style={StyleSheet.absoluteFill}
          />

          {/* Centered content */}
          <View style={styles.center}>
            <View style={styles.titleRow}>
              <Text style={styles.headline}>Inspira </Text>
              <FontAwesome name="quote-left" size={36} color="#1B9AAA" />
            </View>
            <Text style={styles.subheadline}>
              Swipe up to get inspired 🌟
            </Text>
          </View>

          {/* Bottom arrow & text */}
          <View style={styles.bottom}>
            <Animated.View style={arrowStyle}>
              <FontAwesome name="angle-up" size={40} color="#1B9AAA" />
            </Animated.View>
            <Text style={styles.swipeText}>Swipe up to get started</Text>
          </View>
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  titleRow: { flexDirection: "row", alignItems: "center" },
  headline: {
    fontSize: 36,
    fontWeight: "bold",
    fontStyle: "italic", // italic + bold
    color: "#1B9AAA", // cyan highlight (same as login title)
  },
  subheadline: {
    fontSize: 18,
    color: "#FF6B6B", // coral accent (same as login subtitle)
    textAlign: "center",
    marginTop: 10,
  },
  bottom: { alignItems: "center", marginBottom: 20 },
  swipeText: {
    fontSize: 14,
    color: "#1B9AAA", // cyan for harmony with buttons/icons
    marginTop: 5,
  },
});
