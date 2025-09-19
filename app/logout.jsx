// screens/EventListScreen.jsx
import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Button, Alert, Text } from "react-native";
import { collection, onSnapshot } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import EventItem from "../components/EventItems";
import { signOut } from "firebase/auth";

export default function EventListScreen({ navigation }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "events"), (snapshot) => {
      setEvents(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace("Login");
    } catch (error) {
      Alert.alert("Logout Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Logout" onPress={handleLogout} />
      {events.length === 0 ? (
        <Text style={styles.noEvents}>No events available.</Text>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EventItem
              event={item}
              onPress={() => navigation.navigate("EventDetails", { eventId: item.id })}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  noEvents: { marginTop: 20, textAlign: "center", fontSize: 16, color: "#555" },
});
