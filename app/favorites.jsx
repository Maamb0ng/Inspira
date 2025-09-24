import { Ionicons, AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { auth, db } from "../firebaseConfig";

export default function FavoriteQuotes() {
  const [favorites, setFavorites] = useState([]);
  const router = useRouter();

  const fetchFavorites = async () => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "favorites"),
      where("userId", "==", auth.currentUser.uid)
    );

    const snapshot = await getDocs(q);
    const favs = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      favs.push({
        id: docSnap.id,
        text: data && data.text ? String(data.text) : "No text",
      });
    });
    setFavorites(favs);
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const removeFavorite = async (id) => {
    await deleteDoc(doc(db, "favorites", id));
    fetchFavorites();
  };

  const renderItem = ({ item }) => {
    const text = item && item.text ? String(item.text) : "No text";
    return (
      <View style={styles.quoteBox}>
        <Text style={styles.quoteText}>{text}</Text>
        <TouchableOpacity onPress={() => removeFavorite(item.id)}>
          <AntDesign name="delete" size={22} color="#FF6B6B" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#3AAFA9" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Favorites</Text>
        <View style={{ width: 28 }} />
      </View>

      <FlatList
        data={favorites ?? []}
        keyExtractor={(item) => item.id ?? Math.random().toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 30 }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No favorites yet.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F4F8",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    marginTop: 40,
  },
  headerTitle: {
    color: "#37474F",
    fontSize: 20,
    fontWeight: "bold",
  },
  quoteBox: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  quoteText: {
    color: "#37474F",
    fontSize: 16,
    flex: 1,
    marginRight: 10,
  },
  emptyText: {
    color: "#A0A8B0",
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
  },
});
