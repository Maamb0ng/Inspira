import { useState } from "react";
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function EventList() {
  const [events] = useState([
    {
      id: "1",
      name: "Coldplay World Tour 2025",
      date: "October 12, 2025",
      location: "Mall of Asia Arena, Manila",
    },
    {
      id: "2",
      name: "Taylor Swift Eras Tour",
      date: "November 5, 2025",
      location: "Singapore National Stadium",
    },
    {
      id: "3",
      name: "BTS Reunion Concert",
      date: "December 20, 2025",
      location: "Tokyo Dome, Japan",
    },
  ]);

  const handleBooking = (eventName) => {
    Alert.alert("🎟️ Ticket Booked", `You booked a ticket for: ${eventName}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>🎶 Upcoming Concerts</Text>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View>
              <Text style={styles.eventName}>{item.name}</Text>
              <Text style={styles.eventInfo}>{item.date}</Text>
              <Text style={styles.eventInfo}>{item.location}</Text>
            </View>
            <TouchableOpacity
              style={styles.bookButton}
              onPress={() => handleBooking(item.name)}
            >
              <Text style={styles.bookText}>Book Now</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f9fafb" },
  heading: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 12,
    borderRadius: 10,
    elevation: 3,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  eventName: { fontSize: 18, fontWeight: "600" },
  eventInfo: { fontSize: 14, color: "gray" },
  bookButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  bookText: { color: "#fff", fontWeight: "600" },
});
