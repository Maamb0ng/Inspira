// components/GuestItem.jsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function GuestItem({ guest }) {
  return (
    <View style={styles.item}>
      <Text>{guest.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
});
