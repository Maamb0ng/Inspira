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
      withSequence(withSpring(-15, { damping: 5, stiffness: 120 }), withSpring(0, { damping: 5, stiffness: 120 })),
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
          <LinearGradient
            colors={["#E0F7FA", "#FFFFFF", "#E0F7FA"]}
            style={StyleSheet.absoluteFill}
          />

          <View style={styles.center}>
            <View style={styles.titleRow}>
              <Text style={styles.headline}>Inspira </Text>
              <FontAwesome name="quote-left" size={36} color="#3AAFA9" />
            </View>
            <Text style={styles.subheadline}>Swipe up to get inspired 🌟</Text>
          </View>

          <View style={styles.bottom}>
            <Animated.View style={[arrowStyle, styles.arrowShadow]}>
              <FontAwesome name="angle-up" size={40} color="#3AAFA9" />
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
    fontStyle: "italic",
    color: "#3AAFA9",
  },
  subheadline: {
    fontSize: 18,
    color: "#FF7F50",
    textAlign: "center",
    marginTop: 10,
  },
  bottom: { alignItems: "center", marginBottom: 20 },
  swipeText: {
    fontSize: 14,
    color: "#3AAFA9",
    marginTop: 5,
  },
  arrowShadow: {
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
});
