// components/EventItem.jsx
import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

export default function EventItem({ event, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.item}>
      <Text style={styles.title}>{event.title}</Text>
      <Text style={styles.date}>{event.date || "No date provided"}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    padding: 16,
    backgroundColor: "#f2f2f2",
    marginBottom: 12,
    borderRadius: 6,
  },
  title: { fontSize: 18, fontWeight: "bold" },
  date: { color: "#666", marginTop: 4 },
});
