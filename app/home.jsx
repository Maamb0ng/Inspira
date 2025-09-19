import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function Home({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎤 Welcome to Eventify</Text>
      <Text style={styles.subtitle}>
        Discover and book your favorite concerts worldwide.
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Events")}
      >
        <Text style={styles.buttonText}>Browse Concerts</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  subtitle: { fontSize: 16, color: "gray", marginBottom: 20, textAlign: "center" },
  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
